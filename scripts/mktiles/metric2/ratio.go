package metric2

import (
	"fmt"
	"math"

	"github.com/ONSdigital/dp-census-atlas/scripts/mktiles/types"
)

// CalcRatios changes category values into ratios of the value and the total value
// for that category and the total category.
// Only used for 2011 data where the "0001" columns are totals.
// 2021 data is supposed to be ratios already.
func (m *M) CalcRatios() error {
	for _, cat := range m.cats {
		tabcol := m.catidx[cat]

		totcat, err := GuessTotalsCat(cat)
		if err != nil {
			return err
		}
		totcol, ok := m.totidx[totcat]
		if !ok {
			return fmt.Errorf("totals category %s not in table", totcat)
		}

		for tabrow, geo := range m.geos {
			val := float64(m.tab[tabrow][tabcol])
			tot := float64(m.tab[tabrow][totcol])

			// if both val and tot are NaN, then this is a geo that was
			// was not mentioned at all in any metrics files, skip
			if math.IsNaN(val) && math.IsNaN(tot) {
				continue
			}
			if math.IsNaN(val) {
				return fmt.Errorf("CalcRatios: %s %s: NaN", geo, cat)
			}
			if math.IsNaN(tot) {
				return fmt.Errorf("CalcRatios: %s %s: NaN", geo, cat)
			}
			if tot == 0.0 {
				return fmt.Errorf("CalcRatio: %s %s: total is 0", geo, cat)
			}

			m.tab[tabrow][tabcol] = types.Value(val / tot * 100.0)
		}
	}
	return nil
}
