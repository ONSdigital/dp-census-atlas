package contentv1

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
	Convey("With a loaded version 2 content.json", t, func() {
		f, err := os.Open(filepath.Join("testdata", fname))
		So(err, ShouldBeNil)
		defer f.Close()

		v1, err := Load(f)
		So(err, ShouldBeNil)

		Convey("All categories should be found", func() {
			want := []string{}
			got, err := v1.Categories("wrong classification code")
			So(err, ShouldBeNil)
			So(got, ShouldResemble, want)

			want = []string{
				"highest_qualification_6a-000",
				"highest_qualification_6a-001",
				"highest_qualification_6a-002",
				"highest_qualification_6a-003",
				"highest_qualification_6a-004",
			}
			got, err = v1.Categories("highest_qualification_6a")
			So(err, ShouldBeNil)
			So(got, ShouldResemble, want)

			want = []string{
				"highest_qualification-000",
				"highest_qualification-001",
				"highest_qualification-002",
				"highest_qualification-003",
				"highest_qualification-004",
				"highest_qualification-005",
				"highest_qualification-006",
			}
			got, err = v1.Categories("highest_qualification")
			So(err, ShouldBeNil)
			So(got, ShouldResemble, want)

			want = []string{
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
			}

			got, err = v1.Categories("")
			So(err, ShouldBeNil)
			So(got, ShouldResemble, want)
		})

		Convey("Name to Category map should be built", func() {
			want := map[string]string{}
			got, err := v1.NamesToCats("wrong classification code", "")
			So(err, ShouldBeNil)
			So(got, ShouldResemble, want)

			want = map[string]string{
				"No qualifications": "highest_qualification_6a-000",
				"Highest level of qualification: Level 1, 2 or 3 qualifications":   "highest_qualification_6a-001",
				"Highest level of qualification: Apprenticeship":                   "highest_qualification_6a-002",
				"Highest level of qualification: Level 4 qualifications and above": "highest_qualification_6a-003",
				"Highest level of qualification: Other qualifications":             "highest_qualification_6a-004",
			}
			got, err = v1.NamesToCats("highest_qualification_6a", "")
			So(err, ShouldBeNil)
			So(got, ShouldResemble, want)

			want = map[string]string{
				"No qualifications": "highest_qualification-000",
				"Level 1 and entry level qualifications: 1 to 4 GCSEs grade A* to C , Any GCSEs at other grades, O levels or CSEs (any grades), 1 AS level, NVQ level 1, Foundation GNVQ, Basic or Essential Skills":                                                                                                                                   "highest_qualification-001",
				"Level 2 qualifications: 5 or more GCSEs (A* to C or 9 to 4), O levels (passes), CSEs (grade 1), School Certification, 1 A level, 2 to 3 AS levels, VCEs, Intermediate or Higher Diploma, Welsh Baccalaureate Intermediate Diploma, NVQ level 2, Intermediate GNVQ, City and Guilds Craft, BTEC First or General Diploma, RSA Diploma": "highest_qualification-002",
				"Apprenticeship": "highest_qualification-003",
				"Level 3 qualifications: 2 or more A levels or VCEs, 4 or more AS levels, Higher School Certificate, Progression or Advanced Diploma, Welsh Baccalaureate Advance Diploma, NVQ level 3; Advanced GNVQ, City and Guilds Advanced Craft, ONC, OND, BTEC National, RSA Advanced Diploma": "highest_qualification-004",
				"Level 4 qualifications and above: degree (BA, BSc), higher degree (MA, PhD, PGCE), NVQ level 4 to 5, HNC, HND, RSA Higher Diploma, BTEC Higher level, professional qualifications (for example, teaching, nursing, accountancy)":                                                     "highest_qualification-005",
				"Other: vocational or work-related qualifications, other qualifications achieved in England or Wales, qualifications achieved outside England or Wales (equivalent not stated or unknown)":                                                                                            "highest_qualification-006",
			}
			got, err = v1.NamesToCats("highest_qualification", "")
			So(err, ShouldBeNil)
			So(got, ShouldResemble, want)

			got, err = v1.NamesToCats("", "")
			So(err, ShouldNotBeNil)
			So(got, ShouldBeNil)
		})
	})
}
