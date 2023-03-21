package main

import (
	"encoding/csv"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strconv"
)

// DataSet holds data from the spreadsheet organised by Indicator
type DataSet struct {
	Indicators map[string]*Indicator // key is indicator string
}

type Indicator struct {
	Period  string
	Measure string
	Unit    string
	Metrics map[string][]Metric // key is geotype code
}

type Metric struct {
	Geocode string
	Value   float64
}

func NewDataSet() *DataSet {
	return &DataSet{
		Indicators: make(map[string]*Indicator),
	}
}

// FindIndicator looks up or creates a new Indicator with the given attributes.
func (ds *DataSet) FindIndicator(desc, period, measure, unit string) (*Indicator, error) {
	// create an Indicator if one doesn't exist
	ind, ok := ds.Indicators[desc]
	if !ok {
		ind = &Indicator{
			Period:  period,
			Measure: measure,
			Unit:    unit,
			Metrics: make(map[string][]Metric),
		}
		ds.Indicators[desc] = ind
		return ind, nil
	}

	// make sure these attributes agree with existing attributes
	// (fields are duplicated on each spreadsheet row; make sure they agree)
	cmp := func(ind *Indicator, period, measure, unit string) string {
		if period != ind.Period {
			return fmt.Sprintf("Period (%q %q)", period, ind.Period)
		}
		if measure != ind.Measure {
			return fmt.Sprintf("Measure (%q %q)", measure, ind.Measure)
		}
		if unit != ind.Unit {
			return fmt.Sprintf("Unit (%q %q)", unit, ind.Unit)
		}
		return ""
	}

	attr := cmp(ind, period, measure, unit)
	if attr != "" {
		return nil, fmt.Errorf("%s: inconsistent indicator attribute values", attr)
	}

	return ind, nil
}

// TrimGeotypes removes geotypes from Indicators where there are no metrics with the given prefix.
//
// For example, if geotype is "LTLA" and prefix is "E07", LTLA geotypes without geocodes
// that start with E07 will be removed.
func (ds *DataSet) TrimGeotypes(geotype, prefix string) {
	for desc, ind := range ds.Indicators {
		for thisgeotype, metrics := range ind.Metrics {
			if thisgeotype != geotype {
				continue
			}
			hasprefix := false
			for _, metric := range metrics {
				geocode := metric.Geocode
				if len(geocode) != 9 {
					continue
				}
				if geocode[0:3] == prefix {
					hasprefix = true
					break
				}
			}
			if !hasprefix {
				delete(ind.Metrics, geotype)
				log.Printf("trimmed geotype %s (missing %s) from %s", geotype, prefix, desc)
			}
		}
	}
}

// AppendMetric appends a new geocode,value to an Indicator
func (ind *Indicator) AppendMetric(geotype, geocode string, value float64) {
	metrics, ok := ind.Metrics[geotype]
	if !ok {
		metrics = []Metric{}
	}
	ind.Metrics[geotype] = append(metrics, Metric{geocode, value})
}

// WriteTiles creates tiles under base dir
func (ds *DataSet) WriteTiles(base string) error {
	for desc, ind := range ds.Indicators {
		for geotype, values := range ind.Metrics {

			// generate directory and filenames
			dir := filepath.Join(base, "tiles", geotype)
			indname := ZapSpecial(desc)
			outname := filepath.Join(dir, indname) + ".csv"
			tmpname := outname + ".tmp"

			// create directory and temporary output file
			if err := os.MkdirAll(dir, 0755); err != nil {
				return err
			}
			w, err := os.Create(tmpname)
			if err != nil {
				return err
			}

			// write CSV header
			csvw := csv.NewWriter(w)
			csvw.Write([]string{"geography_code", indname})

			// write CSV rows
			for _, value := range values {
				record := []string{
					value.Geocode,
					strconv.FormatFloat(value.Value, 'g', -1, 64),
				}
				csvw.Write(record)
			}

			// check for errors and close temporary file
			csvw.Flush()
			if err := csvw.Error(); err != nil {
				w.Close()
				return err
			}
			if err := w.Close(); err != nil {
				return err
			}

			// snap file into place
			if err := os.Rename(tmpname, outname); err != nil {
				return err
			}
		}
	}
	return nil
}
