package geo

import (
	"encoding/csv"
	"fmt"
	"os"

	"github.com/ONSdigital/dp-census-atlas/mktiles/types"

	"github.com/jszwec/csvutil"
	"github.com/spkg/bom"
)

// LoadRecodes loads a "recodes" CSV file.
// A recodes CSV file contains a list of geocodes to change.
// So far this is only used as a special case for a handful
// of 2011/2017 LADs.
//
// The return value is a mapping from old geocode to new.
func LoadRecodes(fname string) (map[string]string, error) {
	f, err := os.Open(fname)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	// The file may contain a UTF-8 BOM
	bomreader := bom.NewReader(f)

	csvreader := csv.NewReader(bomreader)
	dec, err := csvutil.NewDecoder(csvreader)
	if err != nil {
		return nil, err
	}

	type row struct {
		From string `csv:"FromCode"`
		To   string `csv:"ToCode"`
	}

	var rows []row
	if err := dec.Decode(&rows); err != nil {
		return nil, err
	}

	newcodes := map[string]string{}
	for _, row := range rows {
		newcodes[row.From] = row.To
	}

	return newcodes, nil
}

// Recode changes the geocodes of geographies of type geotype using the newcodes map.
func (a *Atlas) Recode(geotype types.Geotype, newcodes map[string]string) error {
	col, ok := a.Collections[geotype]
	if !ok {
		return fmt.Errorf("recode: no geotype %s loaded", geotype)
	}

	for n, feat := range col.Features {
		geocode, ok := feat.Properties["geocode"].(string)
		if !ok {
			return fmt.Errorf("recode: geotype %s feature %d: no geocode property", geotype, n)
		}
		newcode, ok := newcodes[geocode]
		if !ok {
			continue
		}

		// we also need to update our codeTypes mapping of geocode -> geotype
		delete(a.codeTypes, types.Geocode(geocode))
		feat.Properties["geocode"] = newcode
		a.codeTypes[types.Geocode(newcode)] = geotype
	}
	return nil
}
