package geo

import (
	"encoding/json"
	"reflect"
	"testing"
)

func Test_MSOAnames(t *testing.T) {
	a := New()

	if _, err := a.LoadCollection("testdata/msoa-in.geojson", MSOA); err != nil {
		t.Fatalf("%s", err)
	}
	enames, wnames, err := LoadMSOAnames("testdata/msoa-names.csv")
	if err != nil {
		t.Fatalf("%s", err)
	}
	err = a.RenameMSOAs(enames, wnames)
	if err != nil {
		t.Fatalf("%s", err)
	}

	want, err := LoadGeojson("testdata/msoa-out.geojson")
	if err != nil {
		t.Fatalf("%s", err)
	}

	if !reflect.DeepEqual(a.Collections[MSOA], want) {
		j, _ := json.Marshal(a.Collections[MSOA])
		t.Logf("got:  %s", j)
		j, _ = json.Marshal(want)
		t.Logf("want: %s", j)
		t.Fatalf("not equal")
	}
}
