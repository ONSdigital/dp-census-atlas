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
	"github.com/ONSdigital/dp-census-atlas/scripts/mktiles/metric2"
	"github.com/ONSdigital/dp-census-atlas/scripts/mktiles/types"
)

const (
	TILES_DIR    = "tiles"
	BREAKS_DIR   = "breaks"
	CKBREAKS_DIR = "breaksCkmeans"

	MSOA_NAMES_CSV  = "msoa-names.csv"
	CONTENT_JSON    = "content.json"
	GRID_JSON       = "DataTileGrid.json"
	RECODE_LADS_CSV = "recode-lads.csv"
)

func main() {
	indir := flag.String("I", "./in/", "directory holding input files")
	outdir := flag.String("O", "./out/", "directory to hold output files (must be empty)")
	doRatios := flag.Bool("R", false, "calculate percentages (eg 2011 data)")
	doFake := flag.Bool("F", false, "generate fake metrics")
	force := flag.Bool("f", false, "force using an existing out directory")
	contentName := flag.String("c", "", "path to content.json (default content.json within input dir)")
	classCode := flag.String("C", "", "classification code to match in content.json (blank means all)")
	doCatNameMatching := flag.Bool("M", false, "match categories from input files based on name rather than code")
	catNamePrefix := flag.String("N", "", "when doCatNameMatching=true, optional prefix for cat names as they are found in input files")
	flag.Parse()

	if *contentName == "" {
		*contentName = filepath.Join(*indir, CONTENT_JSON)
	}
	log.Printf("            input dir: %s", *indir)
	log.Printf("         content.json: %s", *contentName)
	log.Printf("  classification code: %s", *classCode)
	log.Printf("           output dir: %s", *outdir)
	log.Printf("          calc ratios: %t", *doRatios)
	log.Printf("generate fake metrics: %t", *doFake)
	log.Printf("                force: %t", *force)
	log.Printf("matching cats by name: %t", *doCatNameMatching)
	log.Printf("using cat name prefix: %s", *catNamePrefix)

	if err := setupOutDir(*outdir, *force); err != nil {
		log.Fatal(err)
	}

	//
	// load content.json
	//
	log.Printf("loading content.json")
	cont, err := content.LoadName(*contentName)
	if err != nil {
		log.Fatal(err)
	}
	wantcats, err := cont.Categories(*classCode)
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("found %d categories", len(wantcats))

	//
	// make cat name to cat code map
	//
	namesToCats, err := cont.NamesToCats(*classCode, *catNamePrefix)
	if err != nil {
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
	for geocode, items := range grid {
		log.Printf("found %d %s quads in grid file\n", len(items), geocode)
	}

	//
	// set up notional spreadsheet
	//
	m, err := metric2.New(strings2cats(wantcats), *doRatios)
	if err != nil {
		log.Fatal(err)
	}

	//
	// load metrics if not faking
	//
	if !*doFake {
		log.Printf("loading metrics files")
		if err := m.LoadAll(*indir, MSOA_NAMES_CSV, *doCatNameMatching, namesToCats); err != nil {
			log.Fatal(err)
		}
		missingCats := m.MissingCats()
		if len(missingCats) > 0 {
			log.Printf("Categories in %s, but not in any metrics files:", *contentName)
			for _, cat := range missingCats {
				log.Printf("\t%s", cat)
			}
			log.Fatal("missing categories in metrics files")
		}
	}

	//
	// Load and normalise geojson files
	//
	atlas := geo.New()
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
	// Generate fake data if faking
	//
	if *doFake {
		log.Print("generating fake data")
		m.Fake(atlas.Geocodes(), 0) // XXX first arg?
	}

	// ratios
	//
	if *doRatios {
		log.Printf("calculating ratios")
		if err := m.CalcRatios(); err != nil {
			log.Fatal(err)
		}
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
	if err := m.MakeBreaks(filepath.Join(*outdir, BREAKS_DIR), filepath.Join(*outdir, CKBREAKS_DIR), atlas.GeotypeOf); err != nil {
		log.Fatal(err)
	}
}

func setupOutDir(dir string, force bool) error {
	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}
	if force {
		return nil
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
		nfound, err := atlas.LoadCollection(fname, geotype)
		if err != nil {
			if !errors.Is(err, fs.ErrNotExist) {
				return err
			}
			log.Printf("no %s file to load", fname)
			continue
		}
		log.Printf("found %d %s geocodes", nfound, geotype)

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

func strings2cats(cats []string) []types.Category {
	res := []types.Category{}
	for _, cat := range cats {
		res = append(res, types.Category(cat))
	}
	return res
}

func generateTiles(grid map[types.Geotype][]grid.Quad, dir string, atlas *geo.Atlas, m *metric2.M) error {
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
			//log.Printf("%s %s: %d quad intersections\n", geotype, quad.Tilename, len(geos))
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
