package main

import (
	"errors"
	"flag"
	"fmt"
	"io"
	"io/fs"
	"log"
	"os"
	"path/filepath"

	"github.com/ONSdigital/dp-census-atlas/scripts/mktiles/content"
	"github.com/ONSdigital/dp-census-atlas/scripts/mktiles/files"
	"github.com/ONSdigital/dp-census-atlas/scripts/mktiles/geo"
	"github.com/ONSdigital/dp-census-atlas/scripts/mktiles/grid"
	"github.com/ONSdigital/dp-census-atlas/scripts/mktiles/metric"
	"github.com/ONSdigital/dp-census-atlas/scripts/mktiles/types"
)

const (
	TILES_DIR  = "tiles"
	BREAKS_DIR = "breaks"

	MSOA_NAMES_CSV  = "msoa-names.csv"
	CONTENT_JSON    = "content.json"
	GRID_JSON       = "DataTileGrid.json"
	RECODE_LADS_CSV = "recode-lads.csv"
)

func main() {
	indir := flag.String("I", "./in/", "directory holding input files")
	outdir := flag.String("O", "./out/", "directory to hold output files (must be empty)")
	doRatios := flag.Bool("R", false, "calculate ratios (eg 2011 data)")
	doFake := flag.Bool("F", false, "generate fake metrics")
	flag.Parse()

	log.Printf("            input dir: %s", *indir)
	log.Printf("           output dir: %s", *outdir)
	log.Printf("          calc ratios: %t", *doRatios)
	log.Printf("generate fake metrics: %t", *doFake)

	if err := setupOutDir(*outdir); err != nil {
		log.Fatal(err)
	}

	atlas := geo.New()
	m := metric.New()

	//
	// Load and normalise geojson files
	//
	if err := loadGeojson(*indir, atlas); err != nil {
		log.Fatal(err)
	}

	//
	// generate geoLookup.json
	//
	log.Printf("generating geoLookup.json")
	lookups, err := atlas.GeoLookup(geo.LAD, geo.MSOA)
	if err != nil {
		log.Fatal(err)
	}
	err = files.SaveJSON(filepath.Join(*outdir, "geoLookup.json"), false, lookups)
	if err != nil {
		log.Fatal(err)
	}

	//
	// load content.json
	//
	log.Printf("loading content.json")
	cont, err := content.LoadName(filepath.Join(*indir, CONTENT_JSON))
	if err != nil {
		log.Fatal(err)
	}

	//
	// load metrics or generate fake metrics
	//
	m.WantCats(cont.Categories())
	if err := loadMetrics(*indir, atlas, m, *doFake, *doRatios); err != nil {
		log.Fatal(err)
	}

	//
	// load grid file
	//
	log.Printf("loading grid file")
	grid, err := grid.Load(filepath.Join(*indir, GRID_JSON))
	if err != nil {
		log.Fatal(err)
	}

	//
	// generate data tiles
	//
	log.Printf("generating tiles")
	if err := generateTiles(grid, filepath.Join(*outdir, TILES_DIR), atlas, m); err != nil {
		log.Fatal(err)
	}

	//
	// generate breaks files
	//
	log.Printf("generating breaks")
	if err := m.MakeBreaks(filepath.Join(*outdir, BREAKS_DIR), atlas.GeotypeOf); err != nil {
		log.Fatal(err)
	}
}

func setupOutDir(dir string) error {
	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}

	f, err := os.Open(dir)
	if err != nil {
		return err
	}
	defer f.Close()

	_, err = f.ReadDir(1)
	if err == nil {
		return fmt.Errorf("%s: output directory must be empty", dir)
	}
	if !errors.Is(err, io.EOF) {
		return err
	}
	return nil
}

func loadGeojson(dir string, atlas *geo.Atlas) error {
	for _, geotype := range []types.Geotype{geo.LAD, geo.LSOA, geo.MSOA, geo.OA} {
		fname := filepath.Join(dir, geotype.Pathname()+".geojson")
		log.Printf("loading %ss", geotype)
		if err := atlas.LoadCollection(fname, geotype); err != nil {
			if !errors.Is(err, fs.ErrNotExist) {
				return err
			}
			log.Printf("no %s file to load", fname)
			continue
		}

		if geotype == geo.MSOA {
			log.Printf("loading MSOA names file")
			enames, wnames, err := geo.LoadMSOAnames(filepath.Join(dir, MSOA_NAMES_CSV))
			if err != nil {
				return err
			}
			log.Print("renaming MSOAs")
			if err := atlas.RenameMSOAs(enames, wnames); err != nil {
				return err
			}
		}

		log.Printf("normalising %ss", geotype)
		if err := atlas.SetStandardProps(geotype); err != nil {
			log.Fatal(err)
		}

		if geotype == geo.LAD {
			log.Printf("loading LAD recode file")
			fname := filepath.Join(dir, RECODE_LADS_CSV)
			recodes, err := geo.LoadRecodes(fname)
			if err == nil {
				if err = atlas.Recode(geo.LAD, recodes); err != nil {
					return err
				}
			} else if errors.Is(err, fs.ErrNotExist) {
				log.Printf("no %s file to load", fname)
			} else {
				return err
			}
		}
	}
	return nil
}

func loadMetrics(dir string, atlas *geo.Atlas, m *metric.M, doFake, doRatios bool) error {
	if doFake {
		log.Print("generating fake data")
		m.Fake(atlas.Geocodes(), 0)
		return nil
	}

	if doRatios {
		if err := m.IncludeTotalCats(); err != nil {
			return err
		}
	}
	log.Printf("loading metrics files")
	if err := m.LoadAll(dir); err != nil {
		return err
	}
	if doRatios {
		log.Printf("calculating ratios")
		if err := m.CalcRatios(); err != nil {
			return err
		}
	}
	return nil
}

func generateTiles(grid map[types.Geotype][]grid.Quad, dir string, atlas *geo.Atlas, m *metric.M) error {
	for geotype, quads := range grid {
		typedir := filepath.Join(dir, geotype.Pathname())
		if err := os.MkdirAll(typedir, 0755); err != nil {
			return err
		}

		for _, quad := range quads {
			geos, err := atlas.Intersects(geotype, quad.Bbox)
			if err != nil {
				log.Print(err)
				continue
			}
			tiledir := filepath.Join(typedir, quad.Tilename)
			if err := os.MkdirAll(tiledir, 0755); err != nil {
				return err
			}
			if err := m.MakeTiles(geos, tiledir); err != nil {
				return err
			}
		}
	}
	return nil
}
