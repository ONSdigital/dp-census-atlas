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
	if err := a.LoadCollection("noexist", LAD); err == nil {
		t.Fatalf("expected error when geojson doesn't exist")
	}
	if err := a.LoadCollection("testdata/test.geojson", LAD); err != nil {
		t.Fatalf("%s", err)
	}
}
