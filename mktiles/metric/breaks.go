package metric

import (
	"fmt"
	"log"
	"os"
	"path/filepath"

	"github.com/ONSdigital/dp-census-atlas/mktiles/files"
	"github.com/ONSdigital/dp-census-atlas/mktiles/types"

	"github.com/jtrim-ons/ckmeans/pkg/ckmeans"
)

// stats describes a breaks file.
type stats map[types.Category]map[string][]float64

// A TypeLookupFunc is a function that returns the geotype of a given geocode.
type TypeLookupFunc func(types.Geocode) (types.Geotype, bool)

// MakeBreaks creates breaks json in dir.
func (m *M) MakeBreaks(dir string, lookup TypeLookupFunc) error {
	for _, cat := range m.cats {
		ratios := make(map[types.Geotype][]float64)

		// construct separate slice of metric values for each geotype
		for geocode, val := range m.tab[cat] {
			geotype, ok := lookup(geocode)
			if !ok {
				log.Printf("no geotype for geocode %s", geocode)
				continue
			}

			ratios[geotype] = append(ratios[geotype], float64(val))
		}

		// calculate breaks and stats over each geotype's slice of values
		for geotype, vals := range ratios {
			breaks, err := calcBreaks(vals, 5)
			if err != nil {
				return fmt.Errorf(
					"%s %s (%d values): %w",
					geotype,
					cat,
					len(vals),
					err,
				)
			}

			minmax := calcMinMax(vals)

			result := stats{
				cat: map[string][]float64{
					string(geotype):              breaks,
					string(geotype) + "_min_max": minmax,
				},
			}

			if err := saveStats(dir, geotype, cat, result); err != nil {
				return fmt.Errorf("%s %s: %w", geotype, cat, err)
			}
		}
	}
	return nil
}

// calcBreaks gets k ckmeans clusters from metrics and returns the upper breakpoints for each cluster.
func calcBreaks(metrics []float64, k int) ([]float64, error) {
	clusters, err := ckmeans.Ckmeans(metrics, k)
	if err != nil {
		return nil, err
	}

	var breaks []float64
	for _, cluster := range clusters {
		bp := cluster[len(cluster)-1]
		breaks = append(breaks, bp)
	}
	return breaks, nil
}

// calcMinMax calculates the min and max values in a slice of float64s.
func calcMinMax(values []float64) []float64 {
	max := values[0]
	min := values[0]
	for _, v := range values {
		if v > max {
			max = v
		}
		if v < min {
			min = v
		}
	}
	return []float64{min, max}
}

// saveStats writes a breaks file to dir/geotype/cat.json.
func saveStats(dir string, geotype types.Geotype, cat types.Category, result stats) error {
	d := filepath.Join(dir, geotype.Pathname())
	if err := os.MkdirAll(d, 0755); err != nil {
		return err
	}

	name := filepath.Join(d, string(cat)+".json")

	return files.SaveJSON(name, true, result)
}
