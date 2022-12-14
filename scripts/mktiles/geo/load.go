package geo

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
	"strings"

	"github.com/ONSdigital/dp-census-atlas/scripts/mktiles/types"

	"github.com/twpayne/go-geom/encoding/geojson"
)

// LoadCollection loads the geojson file fname into Atlas a.
// Features within this geojson will be recorded as having type geotype.
func (a *Atlas) LoadCollection(fname string, geotype types.Geotype) (int, error) {
	col, err := LoadGeojson(fname)
	if err != nil {
		return 0, err
	}
	a.Collections[geotype] = col
	return len(col.Features), nil
}

// LoadGeojson loads a geojson file and returns it as a go-geom
// geojson.FeatureCollection.
func LoadGeojson(name string) (*geojson.FeatureCollection, error) {
	f, err := os.Open(name)
	if err != nil {
		return nil, err
	}
	defer f.Close()
	/*
		dec := json.NewDecoder(f)
		var col geojson.FeatureCollection
		if err = dec.Decode(&col); err != nil {
			return nil, err
		}
		return &col, nil
	*/
	return parse(f)
}

func parse(r io.Reader) (*geojson.FeatureCollection, error) {
	col := geojson.FeatureCollection{}
	dec := json.NewDecoder(r)

	// expect '{' delimiter
	tok, err := dec.Token()
	if err != nil {
		return nil, fmt.Errorf("offset %d: %w", dec.InputOffset(), err)
	}
	if delim, ok := tok.(json.Delim); ok {
		if delim != '{' {
			return nil, fmt.Errorf("offset %d: expected \"{\", got %q", dec.InputOffset(), delim)
		}
	}

	// loop through the top level keys, skipping all except "feature"
	for {
		// expect key or '}' delimiter
		tok, err := dec.Token()
		if err != nil {
			return nil, fmt.Errorf("offset %d: %w", dec.InputOffset(), err)
		}
		if delim, ok := tok.(json.Delim); ok {
			if delim == '}' {
				break
			}
			return nil, fmt.Errorf("offset %d: expected \"}\", got %q", dec.InputOffset(), delim)
		}

		// if we did not see '}', then we expect to see a key string
		key, ok := tok.(string)
		if !ok {
			return nil, fmt.Errorf("offset %d: expected top level key", dec.InputOffset())
		}

		// if this key is not "features", then eat its value and go back and check for another key
		if !strings.EqualFold(key, "features") {
			var value interface{}
			if err := dec.Decode(&value); err != nil {
				return nil, fmt.Errorf("offset %d: %w", dec.InputOffset(), err)
			}
			continue
		}

		// expect '[' delimiter starting the list of Features
		tok, err = dec.Token()
		if err != nil {
			return nil, fmt.Errorf("offset %d: %w", dec.InputOffset(), err)
		}
		if delim, ok := tok.(json.Delim); ok {
			if delim != '[' {
				return nil, fmt.Errorf("offset %d: expected \"[\", got %q", dec.InputOffset(), delim)
			}
		}

		// decode each Feature individually
		for dec.More() {
			var feat geojson.Feature
			if err := dec.Decode(&feat); err != nil {
				return nil, fmt.Errorf("offset %d: %w", dec.InputOffset(), err)
			}

			if feat.BBox == nil {
				if feat.Geometry != nil {
					feat.BBox = feat.Geometry.Bounds()
				}
			}
			feat.Geometry = nil // don't need any more; free up space

			col.Features = append(col.Features, &feat)
		}

		// expect ']' delimiter ending the list of Features
		tok, err = dec.Token()
		if err != nil {
			return nil, fmt.Errorf("offset %d: %w", dec.InputOffset(), err)
		}
		if delim, ok := tok.(json.Delim); !ok {
			return nil, fmt.Errorf("offset %d: expected \"]\", got %q", dec.InputOffset(), tok)
		} else if delim != ']' {
			return nil, fmt.Errorf("offset %d: expected \"]\", got %q", dec.InputOffset(), tok)
		}

	}
	return &col, nil
}
