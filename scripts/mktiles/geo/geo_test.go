package geo

import (
	"testing"
)

func Test_SetStandardProps(t *testing.T) {
	a := New()
	if err := a.LoadCollection("testdata/test.geojson", LAD); err != nil {
		t.Fatalf("%s", err)
	}
	if err := a.SetStandardProps(LAD); err != nil {
		t.Fatalf("%s", err)
	}
	props := a.Collections[LAD].Features[0].Properties
	if props["geotype"].(string) != string(LAD) {
		t.Fatalf("geotype %q, want %q", props["geotype"], LAD)
	}
	if props["geocode"].(string) != "E06000001" {
		t.Fatalf("geocode %q, want %q", props["geocode"], "E06000001")
	}
	if props["ename"].(string) != "Hartlepool" {
		t.Fatalf("ename %q, want %q", props["ename"], "Hartlepool")
	}
	if props["wname"].(string) != " " {
		t.Fatalf("wname %q, want %q", props["wname"], " ")
	}
}
