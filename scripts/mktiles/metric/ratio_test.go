package metric

import (
	"testing"

	"github.com/ONSdigital/dp-census-atlas/scripts/mktiles/types"
)

func Test_CalcRatios(t *testing.T) {
	const (
		GEO1 = types.Geocode("GEO1")
		CAT1 = types.Category("CAT0A1")
		CAT2 = types.Category("CAT0A2")
	)

	m := M{
		cats:    []types.Category{CAT2},
		totcats: []types.Category{CAT1},
		tab: map[types.Category]map[types.Geocode]types.Value{
			CAT1: {
				GEO1: 2,
			},
			CAT2: {
				GEO1: 1,
			},
		},
	}

	if err := m.CalcRatios(); err != nil {
		t.Fatal(err)
	}

	got := float64(m.tab[CAT2][GEO1])
	want := 0.5
	if got != want {
		t.Fatalf("got %f, want %f", got, want)
	}
}
