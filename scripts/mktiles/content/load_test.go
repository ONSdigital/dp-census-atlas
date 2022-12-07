package content

import (
	"testing"

	. "github.com/smartystreets/goconvey/convey"
)

func Test_LoadName(t *testing.T) {
	versions := map[string][]string{
		"testdata/v1.json": []string{
			"highest_qualification-000",
			"highest_qualification-001",
			"highest_qualification-002",
			"highest_qualification-003",
			"highest_qualification-004",
			"highest_qualification-005",
			"highest_qualification-006",
			"highest_qualification_6a-000",
			"highest_qualification_6a-001",
			"highest_qualification_6a-002",
			"highest_qualification_6a-003",
			"highest_qualification_6a-004",
		},
		"testdata/v2.json": []string{
			"uk_armed_forces-001",
			"uk_armed_forces-002",
			"uk_armed_forces-003",
			"uk_armed_forces-004",
		},
		"testdata/v3.json": []string{
			"hh_deprivation-001",
			"hh_deprivation-002",
			"hh_deprivation-003",
			"hh_deprivation-004",
			"hh_deprivation-005",
		},
	}

	Convey("Detect each version of content.json", t, func() {
		for fname, want := range versions {
			c, err := LoadName(fname)
			So(err, ShouldBeNil)

			got, err := c.Categories("")
			So(err, ShouldBeNil)
			So(got, ShouldResemble, want)
		}
	})

	Convey("Should detect wrong content.json", t, func() {
		c, err := LoadName("testdata/wrong.json")
		So(err, ShouldNotBeNil)
		So(c, ShouldBeNil)
	})

	Convey("Should detect non-json", t, func() {
		c, err := LoadName("testdata/file.txt")
		So(err, ShouldNotBeNil)
		So(c, ShouldBeNil)
	})
}
