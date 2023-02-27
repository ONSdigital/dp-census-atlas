package geo

import (
	"bytes"
	"encoding/json"
	"os"
	"path/filepath"
	"reflect"
	"strings"
	"testing"

	"github.com/spkg/bom"
	"github.com/twpayne/go-geom/encoding/geojson"
)

func Test_LoadGeojson(t *testing.T) {
	if _, err := LoadGeojson("noexist"); err == nil {
		t.Fatalf("expected error when geojson doesn't exist")
	}
	if _, err := LoadGeojson("testdata/test.geojson"); err != nil {
		t.Fatalf("%s", err)
	}
}

func Test_LoadCollection(t *testing.T) {
	a := New()
	if _, err := a.LoadCollection("noexist", LAD); err == nil {
		t.Fatalf("expected error when geojson doesn't exist")
	}
	n, err := a.LoadCollection("testdata/test.geojson", LAD)
	if err != nil {
		t.Fatalf("%s", err)
	}
	if n != 1 {
		t.Fatalf("loaded %d Features, expected 1", n)
	}
}

// Test_parseGeojson_Failes ensures each type of error is detected.
func Test_parseGeojson_Fails(t *testing.T) {
	var tests = map[string]string{
		"first token must be }":             `[]`,
		"expect key":                        `{x`,
		"non-features value is not valid":   `{"key":value}`,
		"features is is an object":          `{"features":{}}`,
		"features is a string":              `{"features":"string"}`,
		"features element is not a Feature": `{"features":[1]}`,
		"features ends with wrong delim":    `{"features":[}}`,
		"last token must be }":              `{]`,
	}

	for name, buf := range tests {
		r := strings.NewReader(buf)
		col, err := parseGeojson(r)
		if err == nil {
			t.Errorf("test %q: expected fail", name)
			continue
		}
		t.Logf("%s ->  %v\n", name, err)
		if col != nil {
			t.Errorf("test %q: expected nil result", name)
		}
	}
}

// Test_parseGeojson verifies our incremental parser produces the same data structure
// as the standard json decoder.
// The input geojson has features for every combination of bbox and geometry.
func Test_parseGeojson(t *testing.T) {
	for _, fname := range []string{"no-bom-parse-test.geojson", "with-bom-parse-test.geojson"} {
		t.Run(fname, func(t *testing.T) {
			buf, err := os.ReadFile(filepath.Join("testdata", fname))
			if err != nil {
				t.Error(err)
				return
			}

			// use standard decoder to decode the entire geojson file at once
			dec := json.NewDecoder(bom.NewReader(bytes.NewReader(buf)))
			var want geojson.FeatureCollection
			if err = dec.Decode(&want); err != nil {
				t.Error(err)
				return
			}

			// now calculate bboxes and dump geometries like the original SetStandardProps did
			for _, feat := range want.Features {
				if feat.BBox == nil {
					if feat.Geometry != nil {
						feat.BBox = feat.Geometry.Bounds()
					}
				}
				feat.Geometry = nil
			}

			// parse the same geojson with parse
			got, err := parseGeojson(bytes.NewReader(buf))
			if err != nil {
				t.Error(err)
				return
			}

			// make sure parseGeojson returns the same as standard unmarshal
			if !reflect.DeepEqual(got, &want) {
				t.Error("parse results don't equal standard unmarshal")
			}
		})
	}
}

func Test_expectDelim_Fails(t *testing.T) {
	var tests = map[string]string{
		"token not a valid json token": `x`,
		"token not a delimiter":        `"string"`,
		"token wrong delimiter":        `[`,
	}

	for name, buf := range tests {
		r := strings.NewReader(buf)
		dec := json.NewDecoder(r)
		err := expectDelim(dec, '{')
		t.Logf("%s -> %v", name, err)
		if err == nil {
			t.Errorf("test %q: expected fail", name)
		}
	}
}

func Test_expectDelim(t *testing.T) {
	r := strings.NewReader(`{`)
	dec := json.NewDecoder(r)
	err := expectDelim(dec, '{')
	if err != nil {
		t.Error(err)
	}
}

func Test_expectString_Fails(t *testing.T) {
	var tests = map[string]string{
		"token not a valid json token": `x`,
		"token not a string":           `1`,
	}

	for name, buf := range tests {
		r := strings.NewReader(buf)
		dec := json.NewDecoder(r)
		_, err := expectString(dec)
		t.Logf("%s -> %v", name, err)
		if err == nil {
			t.Errorf("test %q: expected fail", name)
		}
	}
}

func Test_expectString(t *testing.T) {
	want := "a string"
	r := strings.NewReader(`"` + want + `"`)
	dec := json.NewDecoder(r)
	got, err := expectString(dec)
	if err != nil {
		t.Error(err)
	}
	if got != want {
		t.Errorf("%s, want %s", got, want)
	}
}
