package main

import (
	"encoding/csv"
	"errors"
	"fmt"
	"io"
	"strconv"
)

var ErrInvalidTable = errors.New("invalid table")

func Load(r io.Reader) ([][]string, error) {
	return csv.NewReader(r).ReadAll()
}

func Extract(t [][]string) ([]float64, error) {
	if len(t) < 1 || len(t[0]) < 2 || t[0][0] != "geography_code" {
		return nil, ErrInvalidTable
	}

	var vals []float64
	for line, rec := range t {
		if line == 0 {
			continue // skip header row
		}
		if len(rec) < 2 {
			return nil, fmt.Errorf("%w: line %d: not enough columns", ErrInvalidTable, line+1)
		}
		cell := rec[1]
		if cell == "NA" {
			continue
		}
		val, err := strconv.ParseFloat(cell, 64)
		if err != nil {
			return nil, fmt.Errorf("%w: line %d: %s", ErrInvalidTable, line+1, err)
		}
		vals = append(vals, val)
	}

	return vals, nil
}
