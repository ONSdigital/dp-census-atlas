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

	return parseGeojson(f)
}

// parseGeojson loads a geojson file feature-by-feature.
// For each feature, a bbox is calculated if necessary, and the geometry field is
// freed because we only need the bbox.
//
// Decoding the entire geojson file at once requires too much memory because all the
// geometry fields are kept until the next stage.
func parseGeojson(r io.Reader) (*geojson.FeatureCollection, error) {
	col := geojson.FeatureCollection{}
	dec := json.NewDecoder(r)

	// expect initial '{'
	if err := expectDelim(dec, '{'); err != nil {
		return nil, err
	}

	// loop through the top level keys, skipping all except "feature"
	for dec.More() {
		// expect key string
		key, err := expectString(dec)
		if err != nil {
			return nil, err
		}

		// if this key is not "features", then eat its value and go back and check for another key
		if !strings.EqualFold(key, "features") {
			var value interface{}
			if err := dec.Decode(&value); err != nil {
				return nil, fmt.Errorf("offset %d: reading value for key %q: %w", dec.InputOffset(), key, err)
			}
			continue
		}

		// expect '[' delimiter starting the list of Features
		if err := expectDelim(dec, '['); err != nil {
			return nil, err
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
		if err := expectDelim(dec, ']'); err != nil {
			return nil, err
		}

	}

	// expect final '}'
	if err := expectDelim(dec, '}'); err != nil {
		return nil, err
	}
	return &col, nil
}

// expectDelim reads the next token from dec and verifies it is a delimiter and that
// its value is delim.
func expectDelim(dec *json.Decoder, delim rune) error {
	tok, err := dec.Token()
	if err != nil {
		return fmt.Errorf("offset %d: expected %c: %w", dec.InputOffset(), delim, err)
	}
	got, ok := tok.(json.Delim)
	if !ok {
		return fmt.Errorf("offset %d: expected %c, got %q", dec.InputOffset(), delim, tok)
	}
	if rune(got) != delim {
		return fmt.Errorf("offset %d: expected delimiter %c, got %c", dec.InputOffset(), delim, got)
	}
	return nil
}

// expectString reads the next token from dec and verifies it is a string.
// Returns the string or non-nil error.
func expectString(dec *json.Decoder) (string, error) {
	tok, err := dec.Token()
	if err != nil {
		return "", fmt.Errorf("offset %d: expected string: %w", dec.InputOffset(), err)
	}
	s, ok := tok.(string)
	if !ok {
		return "", fmt.Errorf("offset %d: expected string, got %q", dec.InputOffset(), tok)
	}
	return s, nil
}
