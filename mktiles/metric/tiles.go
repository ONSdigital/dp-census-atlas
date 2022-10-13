package metric

import (
	"log"
	"path/filepath"
	"strconv"

	"github.com/ONSdigital/dp-census-atlas/mktiles/files"
	"github.com/ONSdigital/dp-census-atlas/mktiles/types"
)

// Temporarily emulate previous version by not including category in header
// when there are no data lines.
// Simplify when we don't use the old version any more.

// MakeTiles creates data tile CSVs in dir.
func (m *M) MakeTiles(geos []types.Geocode, dir string) error {
	for _, cat := range m.cats {
		records := [][]string{
			{"geography_code"},
			//{"geography_code", string(cat)},
		}

		found := false
		for _, geo := range geos {
			val, ok := m.tab[cat][geo]
			if !ok {
				log.Printf("%s %s: value not found", cat, geo)
				continue
			}
			cell := strconv.FormatFloat(float64(val), 'g', 13, 64)
			records = append(records, []string{string(geo), cell})
			found = true
		}
		if found {
			records[0] = append(records[0], string(cat))
		}

		err := files.SaveCSV(filepath.Join(dir, string(cat)+".csv"), records)
		if err != nil {
			return err
		}
	}
	return nil
}
