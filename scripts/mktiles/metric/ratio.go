package metric

import (
	"fmt"
)

// CalcRatios changes category values into ratios of the value and the total value
// for that category and the total category.
// Only used for 2011 data where the "0001" columns are totals.
// 2021 data is supposed to be ratios already.
func (m *M) CalcRatios() error {
	for _, cat := range m.cats {
		totcat, err := GuessTotalsCat(cat)
		if err != nil {
			return err
		}

		for geo, val := range m.tab[cat] {
			tot, ok := m.tab[totcat][geo]
			if !ok {
				return fmt.Errorf("no value for cat %s geo %s", totcat, geo)
			}

			if tot <= 0.0 {
				return fmt.Errorf("bad total for cat %s geo %s", totcat, geo)
			}

			m.tab[cat][geo] = val / tot * 100.0
		}
	}
	return nil
}
