package geo

import (
	"encoding/json"
	"os"

	"github.com/ONSdigital/dp-census-atlas/mktiles/types"

	"github.com/twpayne/go-geom/encoding/geojson"
)

// LoadCollection loads the geojson file fname into Atlas a.
// Features within this geojson will be recorded as having type geotype.
func (a *Atlas) LoadCollection(fname string, geotype types.Geotype) error {
	col, err := LoadGeojson(fname)
	if err != nil {
		return err
	}
	a.Collections[geotype] = col
	return nil
}

// LoadGeojson loads a geojson file and returns it as a go-geom
// geojson.FeatureCollection.
func LoadGeojson(name string) (*geojson.FeatureCollection, error) {
	f, err := os.Open(name)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	dec := json.NewDecoder(f)
	var col geojson.FeatureCollection
	if err = dec.Decode(&col); err != nil {
		return nil, err
	}
	return &col, nil
}
