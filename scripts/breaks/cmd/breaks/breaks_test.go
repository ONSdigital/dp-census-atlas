package main

import (
	"reflect"
	"testing"
)

func Test_Calc_Fail(t *testing.T) {
	var tests = map[string][]float64{
		"no values":          nil,
		"less than k values": []float64{1, 2, 3},
	}

	for name, vals := range tests {
		_, err := Calc(vals, 5)
		if err == nil {
			t.Errorf("%s: expected error", name)
		}
	}
}

func Test_Calc(t *testing.T) {
	var tests = []struct {
		vals   []float64
		breaks []float64
	}{
		{
			[]float64{1, 2, 3}, []float64{1, 1, 2, 3},
		},
		{
			[]float64{1, 2, 2, 3}, []float64{1, 1, 2, 3},
		},
		{
			[]float64{1, 2, 2, 3, 3}, []float64{1, 1, 2, 3},
		},
		{
			[]float64{1, 2, 3, 2, 3}, []float64{1, 1, 2, 3},
		},
		{
			[]float64{3, 2, 3, 2, 1}, []float64{1, 1, 2, 3},
		},
		{
			[]float64{3, 2, 3, 5, 2, 1}, []float64{1, 2, 3, 5},
		},
		{
			[]float64{0, 1, 2, 50, 100, 101, 103}, []float64{0, 2, 50, 103},
		},
		{
			[]float64{-1, 2, -1, 2, 4, 5, 6, -1, 2, -1}, []float64{-1, -1, 2, 6},
		},
	}

	for n, test := range tests {
		breaks, err := Calc(test.vals, 3)
		if err != nil {
			t.Errorf("test %d: %s\n", n, err)
			continue
		}
		if !reflect.DeepEqual(breaks, test.breaks) {
			t.Errorf("test %d: %v, want %v", n, breaks, test.breaks)
		}
	}
}
