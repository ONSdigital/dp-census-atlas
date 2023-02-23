package main

import (
	"reflect"
	"testing"
)

func Test_Extract_Fail(t *testing.T) {
	var tests = map[string][][]string{
		"no rows": {},
		"not enough cols": {
			{"geography_code"},
		},
		"wrong magic": {
			{"not geography_code", "category"},
		},
		"short row": {
			{"geography_code", "category"},
			{"geocode"},
		},
		"bad float": {
			{"geography_code", "category"},
			{"geocode", "not a float"},
		},
	}

	for name, tab := range tests {
		_, err := Extract(tab)
		if err == nil {
			t.Errorf("%s: expected error", name)
		}
	}
}

func Test_Extract(t *testing.T) {
	tab := [][]string{
		{"geography_code", "category"},
		{"a", "1.0"},
		{"b", "NA"},
		{"c", "2.0"},
	}

	got, err := Extract(tab)
	if err != nil {
		t.Fatal(err)
	}

	want := []float64{1.0, 2.0}
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("%v, want %v", got, want)
	}
}
