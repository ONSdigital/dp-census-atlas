package grid

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/ONSdigital/dp-census-atlas/scripts/mktiles/types"

	"github.com/twpayne/go-geom"
)

// grid describes the DataTileGrid.json file.
// DataTileGrid.json holds quads, but the bbox is not in go-geom format.
type grid map[types.Geotype][]cquad

// cquad is a single quad in DataTileGrid.json format.
type cquad struct {
	Tilename string `json:"tilename"`
	Bbox     struct {
		South float64 `json:"south"`
		East  float64 `json:"east"`
		North float64 `json:"north"`
		West  float64 `json:"west"`
	} `json:"bbox"`
}

// quad is a "normal" quad with the bbox in go-geom format for easier processing.
type Quad struct {
	Tilename string
	Bbox     *geom.Bounds
}

// Load loads DataTileGrid.json
func Load(fname string) (map[types.Geotype][]Quad, error) {
	log.Printf("Loading %s", fname)
	f, err := os.Open(fname)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	dec := json.NewDecoder(f)
	var grid grid
	if err := dec.Decode(&grid); err != nil {
		return nil, err
	}

	quads := make(map[types.Geotype][]Quad)
	for geotype, cquads := range grid {
		for _, cq := range cquads {
			var west, south, east, north float64
			s := fmt.Sprintf(
				"%f %f %f %f",
				cq.Bbox.West,
				cq.Bbox.South,
				cq.Bbox.East,
				cq.Bbox.North,
			)
			_, err := fmt.Sscanf(
				s,
				"%f%f %f %f",
				&west,
				&south,
				&east,
				&north,
			)
			if err != nil {
				log.Fatal(err)
			}
			q := Quad{
				Tilename: cq.Tilename,
				Bbox: geom.NewBounds(geom.XY).Set(
					west,  //cq.Bbox.West,
					south, //cq.Bbox.South,
					east,  //cq.Bbox.East,
					north, //cq.Bbox.North,
				),
			}
			key := canonGeotype(geotype)
			quads[key] = append(quads[key], q)
		}
	}
	return quads, nil
}

// canonicalise geotype (upper case)
func canonGeotype(t types.Geotype) types.Geotype {
	// there is probably a better way
	return types.Geotype(strings.ToUpper(string(t)))
}
