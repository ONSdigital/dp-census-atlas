package geo

import (
	"encoding/csv"
	"errors"
	"fmt"
	"os"
	"strings"

	"github.com/spkg/bom"
)

// LoadMSOAnames loads a House of Commons msoa-names.csv file and returns English
// and Welsh name mappings.
// The keys of the returned maps are geocodes, and the values are House of Commons
// names for that geocode.
func LoadMSOAnames(fname string) (enames, wnames map[string]string, err error) {
	f, err := os.Open(fname)
	if err != nil {
		return nil, nil, err
	}
	defer f.Close()

	// The MSOA file may contain a UTF-8 BOM
	bomreader := bom.NewReader(f)

	csvreader := csv.NewReader(bomreader)

	rows, err := csvreader.ReadAll()
	if err != nil {
		return nil, nil, err
	}
	if len(rows) <= 1 {
		return nil, nil, errors.New("not enough data in MSOA names file")
	}

	ccol := findHeader([]string{"msoa21cd", "msoa11cd"}, rows[0])
	ecol := findHeader([]string{"msoa21hclnm", "msoa11hclnm"}, rows[0])
	wcol := findHeader([]string{"msoa21hclnmw", "msoa11hclnmw"}, rows[0])
	if ccol == -1 || ecol == -1 || wcol == -1 {
		return nil, nil, errors.New("could not find headers in MSOA names file")
	}

	enames = map[string]string{}
	wnames = map[string]string{}
	for _, row := range rows[1:] {
		geocode := row[ccol]
		ename := row[ecol]
		if ename != "" {
			enames[geocode] = ename
		}
		wname := row[wcol]
		if wname != "" {
			wnames[geocode] = wname
		}
	}

	return enames, wnames, nil
}

// findHeader searches for one or more strings in a CSV header.
// want is the list of strings to search for.
// row is the CSV header row.
// Comparisons are case-insensitive.
// When a match is found, the 0-based column number is returned.
func findHeader(want []string, row []string) int {
	for i, header := range row {
		for _, s := range want {
			if strings.EqualFold(header, s) {
				return i
			}
		}
	}
	return -1
}

// RenameMSOAs changes MSOA property names to House of Commons names
// contained in the enames and wnames maps.
func (a *Atlas) RenameMSOAs(enames, wnames map[string]string) error {

	col, ok := a.Collections[MSOA]
	if !ok {
		return errors.New("no MSOA geojson loaded")
	}
	if len(col.Features) < 1 {
		return errors.New("no Features in MSOA geojson")
	}

	// Search the first feature's properties for the geocode, English and Welsh name keys.
	// (assume properties for each feature use the same key name and case)
	firstProp := col.Features[0].Properties
	cprop, ok := findPropName([]string{"msoa11cd", "msoa21cd"}, firstProp)
	if !ok {
		return errors.New("could not determine geocode key in MSOA geojson")
	}

	eprop, _ := findPropName([]string{"msoa11nm", "msoa21nm"}, firstProp)

	wprop, _ := findPropName([]string{"msoa11nmw", "msoa21nmw"}, firstProp)

	for n, feat := range col.Features {
		code, ok := feat.Properties[cprop].(string)
		if !ok || code == "" {
			return fmt.Errorf("MSOA feature %d: no %s property", n, cprop)
		}

		ename := enames[code]
		wname := wnames[code]
		if wname == "" {
			wname = ename
		}

		if eprop != "" && ename != "" {
			feat.Properties[eprop] = ename
		}

		if wprop != "" && wname != "" {
			feat.Properties[wprop] = wname
		}
	}
	return nil
}

// findPropName looks for matching property key names.
// If a property key is a case-insensitive match to one of keys, the
// actual property key is returned.
func findPropName(keys []string, props map[string]interface{}) (string, bool) {
	for k, _ := range props {
		for _, key := range keys {
			if strings.EqualFold(k, key) {
				return k, true
			}
		}
	}
	return "", false
}
