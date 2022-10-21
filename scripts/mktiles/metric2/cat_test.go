package metric2

import (
	"testing"

	. "github.com/smartystreets/goconvey/convey"

	"github.com/ONSdigital/dp-census-atlas/scripts/mktiles/types"
)

func Test_GuessTotalsCat_Errors(t *testing.T) {
	var tests = map[string]string{
		"empty string":           "",
		"not a match":            "this is not a category code",
		"already 4 digit totals": "QS402EW0001",
		"already 1 digit totals": "QS402EW1",
	}

	for name, s := range tests {
		_, err := GuessTotalsCat(types.Category(s))
		if err == nil {
			t.Errorf("%s: expected an error", name)
		}
	}
}

func Test_GuessTotalsCat(t *testing.T) {
	var tests = map[string]struct {
		cat  string
		want string
	}{
		"4 digit": {
			cat:  "QS402EW0012",
			want: "QS402EW0001",
		},
		"3 digit": {
			cat:  "AB000CD123",
			want: "AB000CD001",
		},
	}

	for name, test := range tests {
		got, err := GuessTotalsCat(types.Category(test.cat))
		if err != nil {
			t.Errorf("%s: %s", name, err)
			continue
		}
		if string(got) != test.want {
			t.Errorf("%s: %s, want %s", name, got, test.want)
		}
	}
}

func Test_IncludeTotalCats(t *testing.T) {
	Convey("Given an initialised M", t, func() {
		cats := []types.Category{
			types.Category("A1A2"),
			types.Category("A2A2"),
		}
		m, err := New(geos, cats, false)
		So(err, ShouldBeNil)

		Convey("totals categories should be calculated", func() {
			err := m.IncludeTotalCats()
			So(err, ShouldBeNil)

			want := []types.Category{
				types.Category("A1A1"),
				types.Category("A2A1"),
			}
			So(m.totcats, ShouldResemble, want)
		})
	})
}

func Test_CalcRatios(t *testing.T) {
	Convey("Given an initialised M", t, func() {
		geos := []types.Geocode{geoA, geoB, geoC}
		cats := []types.Category{
			types.Category("CAT1A2"),
			types.Category("CAT1A3"),
		}
		m, err := New(geos, cats, true)
		So(err, ShouldBeNil)

		Convey("when a valid CSV is imported", func() {
			records := [][]string{
				{"GeographyCode", "CAT1A1", "CAT1A2", "CAT1A3"},
				{"geoA", "12", "3", "6"},
				{"geoB", "16", "2", "4"},
				{"geoC", "20", "5", "4"},
			}
			err := m.ImportCSV(records)
			So(err, ShouldBeNil)

			Convey("ratios should be calculated", func() {
				err := m.CalcRatios()
				So(err, ShouldBeNil)

				want := []struct {
					geo  string
					cat  string
					want float64
				}{
					{"geoA", "CAT1A2", 0.25},
					{"geoA", "CAT1A3", 0.5},
					{"geoB", "CAT1A2", 0.125},
					{"geoB", "CAT1A3", 0.25},
					{"geoC", "CAT1A2", 0.25},
					{"geoC", "CAT1A3", 0.20},
				}
				for _, t := range want {
					tabrow := m.geoidx[types.Geocode(t.geo)]
					tabcol := m.catidx[types.Category(t.cat)]
					got := m.tab[tabrow][tabcol]
					So(got, ShouldEqual, t.want)
				}
			})

		})
	})
}
