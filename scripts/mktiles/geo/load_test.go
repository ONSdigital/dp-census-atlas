package geo

import (
	"testing"
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
