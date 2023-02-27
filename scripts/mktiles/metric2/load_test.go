package metric2

import (
	"path/filepath"
	"reflect"
	"testing"
)

func Test_LoadCSV_Error(t *testing.T) {
	_, err := LoadCSV("testdata/load/noexist.csv")
	if err == nil {
		t.Errorf("expected error when file doesn't exist")
	}

	_, err = LoadCSV("testdata/load/broken.csv")
	if err == nil {
		t.Errorf("expected error when loading a broken csv")
	}
}

func Test_LoadCSV(t *testing.T) {
	tests := []string{
		"no-bom.csv",
		"with-bom.csv",
	}

	want := [][]string {
		{"geography_code","cat1"},
		{"geoA","1.2"},
		{"geoB","5.6"},
	}

	for _, test := range tests {
		tab, err := LoadCSV(filepath.Join("testdata/load", test))
		if err != nil {
			t.Errorf("%s: %s", test, err)
			continue
		}
		if !reflect.DeepEqual(tab, want) {
			t.Errorf("%s: %v, want %v", test, tab, want)
		}
	}
}
