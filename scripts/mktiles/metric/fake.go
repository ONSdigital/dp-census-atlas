package metric

import (
	"fmt"
	"math/rand"
	"os"

	"github.com/ONSdigital/dp-census-atlas/scripts/mktiles/types"
)

// Fake generates fake metric data.
func (m *M) Fake(geos []types.Geocode, seed int64) {
	rnd := rand.New(rand.NewSource(seed))

	ncells := len(m.cats) * len(geos)
	stride := ncells / 100
	n := 0

	fmt.Fprintf(
		os.Stderr,
		"%d categories x %d geographies = %d cells\n",
		len(m.cats),
		len(geos),
		ncells,
	)
	for _, cat := range m.cats {
		m.tab[cat] = make(map[types.Geocode]types.Value)

		for _, geo := range geos {
			n++
			if stride == 0 || n%stride == 0 {
				fmt.Fprintf(os.Stderr, " %d/%d %d%%\r", n, ncells, (n*100)/ncells)
			}
			m.tab[cat][geo] = types.Value(rnd.Float64() * 100.0)
		}
	}
	fmt.Fprintf(os.Stderr, " %d/%d %d%%\n", ncells, ncells, 100)
}
