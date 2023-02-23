package contentv2

import (
	"os"
	"testing"

	. "github.com/smartystreets/goconvey/convey"
)

func Test_Load(t *testing.T) {
	Convey("With a loaded version 2 content.json", t, func() {
		f, err := os.Open("testdata/content.json")
		So(err, ShouldBeNil)
		defer f.Close()

		v2, err := Load(f)
		So(err, ShouldBeNil)

		Convey("All categories should be found", func() {
			want := []string{}
			got, err := v2.Categories("wrong classification code")
			So(err, ShouldBeNil)
			So(got, ShouldResemble, want)

			want = []string{
				"uk_armed_forces-001",
				"uk_armed_forces-002",
				"uk_armed_forces-003",
				"uk_armed_forces-004",
			}
			got, err = v2.Categories("")
			So(err, ShouldBeNil)
			So(got, ShouldResemble, want)

			got, err = v2.Categories("uk_armed_forces")
			So(err, ShouldBeNil)
			So(got, ShouldResemble, want)
		})

		Convey("Name to Category map should be built", func() {
			want := map[string]string{}
			got, err := v2.NamesToCats("wrong classification code", "")
			So(err, ShouldBeNil)
			So(got, ShouldResemble, want)

			want = map[string]string{
				"Previously served in UK armed forces":                          "uk_armed_forces-001",
				"Previously served in UK reserve armed forces":                  "uk_armed_forces-002",
				"Previously served in both regular and reserve UK armed forces": "uk_armed_forces-003",
				"Has not previously served in any UK armed forces":              "uk_armed_forces-004",
			}
			got, err = v2.NamesToCats("", "")
			So(err, ShouldBeNil)
			So(got, ShouldResemble, want)

			got, err = v2.NamesToCats("uk_armed_forces", "")
			So(err, ShouldBeNil)
			So(got, ShouldResemble, want)
		})
	})
}
