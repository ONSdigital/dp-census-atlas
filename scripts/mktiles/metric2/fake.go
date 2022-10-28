package metric2

import (
	"fmt"
	"math/rand"
	"os"

	"github.com/ONSdigital/dp-census-atlas/scripts/mktiles/types"
)

// Fake generates fake metric data.
// XXX geos is deprecated (metric2 knows all geos already)
func (m *M) Fake(geos []types.Geocode, seed int64) {
	rnd := rand.New(rand.NewSource(seed))

	ncells := len(m.cats) * len(m.geos)
	stride := ncells / 100
	n := 0

	fmt.Fprintf(
		os.Stderr,
		"%d categories x %d geographies = %d cells\n",
		len(m.catidx),
		len(m.geoidx),
		ncells,
	)

	for _, tabrow := range m.geoidx {
		for _, tabcol := range m.catidx {
			n++
			if stride == 0 || n%stride == 0 {
				fmt.Fprintf(os.Stderr, " %d/%d %d%%\r", n, ncells, (n*100)/ncells)
			}
			m.tab[tabrow][tabcol] = types.Value(rnd.Float64() * 100.0)
		}
	}
	fmt.Fprintf(os.Stderr, " %d/%d %d%%\n", ncells, ncells, 100)
}
