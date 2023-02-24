package contentv3

import (
	"os"
	"path/filepath"
	"testing"

	. "github.com/smartystreets/goconvey/convey"
)

func Test_Load(t *testing.T) {
	test_Load_one("content.json", t)
	test_Load_one("content-with-bom.json", t)
}

func test_Load_one(fname string, t *testing.T) {
	Convey("With a loaded version 3 content.json", t, func() {
		f, err := os.Open(filepath.Join("testdata", fname))
		So(err, ShouldBeNil)
		defer f.Close()

		v3, err := Load(f)
		So(err, ShouldBeNil)

		Convey("All categories should be found", func() {
			want := []string{}
			got, err := v3.Categories("wrong classification code")
			So(err, ShouldBeNil)
			So(got, ShouldResemble, want)

			want = []string{
				"hh_deprivation-001",
				"hh_deprivation-002",
				"hh_deprivation-003",
				"hh_deprivation-004",
				"hh_deprivation-005",
			}
			got, err = v3.Categories("")
			So(err, ShouldBeNil)
			So(got, ShouldResemble, want)

			got, err = v3.Categories("hh_deprivation")
			So(err, ShouldBeNil)
			So(got, ShouldResemble, want)
		})

		Convey("Name to Category map should be built", func() {
			want := map[string]string{}
			got, err := v3.NamesToCats("wrong classification code", "")
			So(err, ShouldBeNil)
			So(got, ShouldResemble, want)

			want = map[string]string{
				"2021 Value change: Household is not deprived in any dimension": "hh_deprivation-001",
				"2021 Value change: Household is deprived in one dimension":     "hh_deprivation-002",
				"2021 Value change: Household is deprived in two dimensions":    "hh_deprivation-003",
				"2021 Value change: Household is deprived in three dimensions":  "hh_deprivation-004",
				"2021 Value change: Household is deprived in four dimensions":   "hh_deprivation-005",
			}
			catNamePrefix := "2021 Value change: "
			got, err = v3.NamesToCats("", catNamePrefix)
			So(err, ShouldBeNil)
			So(got, ShouldResemble, want)

			got, err = v3.NamesToCats("hh_deprivation", catNamePrefix)
			So(err, ShouldBeNil)
			So(got, ShouldResemble, want)
		})
	})
}
