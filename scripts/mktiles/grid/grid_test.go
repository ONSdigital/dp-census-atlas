package grid

import (
	"log"
	"path/filepath"
	"testing"

	"github.com/ONSdigital/dp-census-atlas/scripts/mktiles/types"

	"github.com/twpayne/go-geom"
)

func Test_Load_Error(t *testing.T) {
	if _, err := Load("testdata/noexist.json"); err == nil {
		t.Errorf("expected error when grid file doesn't exist")
	}

	if _, err := Load("testdata/broken.json"); err == nil {
		t.Errorf("expected error when loading broken grid file")
	}
}

func Test_Load(t *testing.T) {
	for _, fname := range []string{"no-bom-grid.json", "with-bom-grid.json"} {
		got, err := Load(filepath.Join("testdata", fname))
		if err != nil {
			t.Errorf("%s: %s", fname, err)
			return
		}

		want := map[types.Geotype][]Quad{
			types.Geotype("LAD"): []Quad{
				{
					Tilename: "ew",
					Bbox: geom.NewBounds(geom.XY).Set(
						-7.57, // west
						49.92, // south
						1.76,  // east
						58.64, // north
					),
				},
			},
			types.Geotype("MSOA"): []Quad{
				{
					Tilename: "61-43-7",
					Bbox: geom.NewBounds(geom.XY).Set(
						-8.4375,   // west
						48.922499, // south
						-5.625,    // east
						50.736455, // north
					),
				},
			},
		}

		for geotype, wquads := range want {
			log.Printf("%s: geotype %s", fname, geotype)
			gquads, ok := got[geotype]
			if !ok {
				t.Errorf("%s: missing geotype %s in result", fname, geotype)
				continue
			}
			if len(gquads) != len(wquads) {
				t.Errorf("%s: geotype %s number of quads %d, want %d", fname, geotype, len(gquads), len(wquads))
				continue
			}
			for i, wquad := range wquads {
				gquad := gquads[i]
				log.Printf("%s: tilename %s", fname, gquad.Tilename)
				if gquad.Tilename != wquad.Tilename {
					t.Errorf("%s: geotype %s tilename %s, want %s", fname, geotype, gquad.Tilename, wquad.Tilename)
					continue
				}
				wcoords := coordsOf(wquad.Bbox)
				gcoords := coordsOf(gquad.Bbox)
				log.Printf("\t%s: %v, want %v", fname, gcoords, wcoords)
				if wcoords != gcoords {
					t.Errorf("%s: geotype %s tilename %s, coords %v, want %v", fname, geotype, gquad.Tilename, gcoords, wcoords)
				}
			}
		}
	}
}

func coordsOf(bbox *geom.Bounds) [4]float64 {
	var coords [4]float64
	coords[0] = bbox.Min(0)
	coords[1] = bbox.Min(1)
	coords[2] = bbox.Max(0)
	coords[3] = bbox.Max(1)
	return coords
}
