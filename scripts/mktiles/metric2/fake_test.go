package metric2

import (
	"math"
	"testing"

	. "github.com/smartystreets/goconvey/convey"

	"github.com/ONSdigital/dp-census-atlas/scripts/mktiles/types"
)

// goconvey custom assertion to verify a float64 is not NaN
func shouldNotBeNaN(actual interface{}, expected ...interface{}) string {
	v, ok := actual.(float64)
	if !ok {
		return "isnan wanted float64"
	}
	if math.IsNaN(v) {
		return "is NaN"
	}
	return ""
}

func Test_Fake(t *testing.T) {
	cats := []types.Category{
		types.Category("cows"),
		types.Category("chickens"),
	}
	geos := []types.Geocode{
		types.Geocode("the-north"),
		types.Geocode("the-south"),
	}

	Convey("Given an initialised M", t, func() {
		m, err := New(cats, false)
		So(err, ShouldBeNil)

		Convey("Fake fills the table with random values", func() {
			m.Fake(geos, 0)
			for _, tabrow := range m.geoidx {
				for _, tabcol := range m.catidx {
					So(float64(m.tab[tabrow][tabcol]), shouldNotBeNaN)
				}
			}
		})
	})
}
