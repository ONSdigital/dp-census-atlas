package geo

import (
	"encoding/json"
	"os"
	"reflect"
	"testing"
)

func Test_GeoLookup(t *testing.T) {
	a := New()
	if _, err := a.LoadCollection("testdata/geolookup-in.geojson", LAD); err != nil {
		t.Fatalf("%s", err)
	}

	lookups, err := a.GeoLookup(LAD)
	if err != nil {
		t.Fatalf("%s", err)
	}

	want, err := loadLookups("testdata/geolookup-out.json")
	if err != nil {
		t.Fatalf("%s", err)
	}

	if !reflect.DeepEqual(lookups, want) {
		t.Fatalf("geolookups don't match")
	}
}

func loadLookups(name string) ([]Lookup, error) {
	f, err := os.Open(name)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	dec := json.NewDecoder(f)
	var lookups []Lookup
	if err := dec.Decode(&lookups); err != nil {
		return nil, err
	}
	return lookups, nil
}
