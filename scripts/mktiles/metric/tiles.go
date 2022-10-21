package metric

import (
	"log"
	"path/filepath"
	"strconv"

	"github.com/ONSdigital/dp-census-atlas/scripts/mktiles/files"
	"github.com/ONSdigital/dp-census-atlas/scripts/mktiles/types"
)

// MakeTiles creates data tile CSVs in dir.
func (m *M) MakeTiles(geos []types.Geocode, dir string) error {
	for _, cat := range m.cats {
		records := [][]string{
			{"geography_code", string(cat)},
		}

		found := false
		for _, geo := range geos {
			val, ok := m.tab[cat][geo]
			if !ok {
				continue
			}
			cell := strconv.FormatFloat(float64(val), 'g', 13, 64)
			records = append(records, []string{string(geo), cell})
			found = true
		}

		fname := filepath.Join(dir, string(cat)+".csv")
		if !found {
			log.Printf("%s: no matching geos; not creating", fname)
			continue
		}

		err := files.SaveCSV(fname, records)
		if err != nil {
			return err
		}
	}
	return nil
}
