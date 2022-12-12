package metric2

import (
	"fmt"
	"math"
	"os"
	"path/filepath"
	"reflect"
	"testing"

	. "github.com/smartystreets/goconvey/convey"

	"github.com/ONSdigital/dp-census-atlas/scripts/mktiles/diffr"
	"github.com/ONSdigital/dp-census-atlas/scripts/mktiles/types"
)

const (
	geoA = types.Geocode("geoA")
	geoB = types.Geocode("geoB")
	geoC = types.Geocode("geoC")
	geoD = types.Geocode("geoD")
	geoE = types.Geocode("geoE")
	geoF = types.Geocode("geoF")
	geoG = types.Geocode("geoG")
	geoH = types.Geocode("geoH")
	geoI = types.Geocode("geoI")
	geoJ = types.Geocode("geoJ")
	geoK = types.Geocode("geoK")
	geoL = types.Geocode("geoL")
	geoM = types.Geocode("geoM")
	geoN = types.Geocode("geoN")

	cat1 = types.Category("cat1")
	cat2 = types.Category("cat2")

	type1 = types.Geotype("type1")
	type2 = types.Geotype("type2")
)

var (
	cats = []types.Category{cat1, cat2}
	nan  = types.Value(math.NaN())
)

// goconvey custom assertion to compare M structs
// Cannot just use ShouldResemble because .tab may includes NaNs which aren't directly comparable.
// (Unless goconvey handles NaNs specially, which I couldn't find.)
func shouldBeEquivM(actual interface{}, expected ...interface{}) string {
	a, ok := actual.(*M)
	if !ok {
		return "shouldBeEquivM wanted actual *M"
	}
	if len(expected) != 1 {
		return "shouldBeEquivM missing expected value"
	}
	x, ok := expected[0].(*M)
	if !ok {
		return "shouldBeEquivM wanted expected *M"
	}

	if msg := compareTab(a.tab, x.tab); msg != "" {
		return msg
	}

	if !reflect.DeepEqual(a.geoidx, x.geoidx) {
		return "geoidx does not match"
	}

	if !reflect.DeepEqual(a.catidx, x.catidx) {
		return "catidx does not match"
	}

	if !reflect.DeepEqual(a.totidx, x.totidx) {
		return "totidx does not match"
	}

	if !reflect.DeepEqual(a.geos, x.geos) {
		return "geos does not match"
	}

	if !reflect.DeepEqual(a.cats, x.cats) {
		return "cats does not match"
	}

	if !reflect.DeepEqual(a.totcats, x.totcats) {
		return "totcats does not match"
	}

	return ""
}

// compareTab compares tables a and x and returns an empty string if they are equivalent.
// Returns an error message if they are not equivalent.
func compareTab(a, x [][]types.Value) string {
	if len(a) != len(x) {
		return fmt.Sprintf("tables not the same length (actual %d, expected %d)", len(a), len(x))
	}
	for row := 0; row < len(x); row++ {
		arow := a[row]
		xrow := x[row]
		if len(arow) != len(xrow) {
			return fmt.Sprintf("rows not same length (row %d, actual %d, expected %d)", row, len(arow), len(xrow))
		}
		for col := 0; col < len(xrow); col++ {
			want := float64(xrow[col])
			got := float64(arow[col])
			if math.IsNaN(want) {
				if !math.IsNaN(got) {
					return fmt.Sprintf("row %d, cell %d: want NaN, got %f", row, col, got)
				}
			} else if got != want {
				return fmt.Sprintf("row %d, cell %d: want %f, got %f", row, col, want, got)
			}
		}
	}
	return ""
}

func Test_New(t *testing.T) {
	cat2a1 := types.Category("CAT2A1") // totals category inferred
	cat2a2 := types.Category("CAT2A2")
	cat2a3 := types.Category("CAT2A3")
	cats := []types.Category{cat2a2, cat2a3}

	Convey("New without totals initialises M correctly", t, func() {
		m, err := New(cats, false)
		So(err, ShouldBeNil)

		want := &M{
			tab:    [][]types.Value{},
			geoidx: map[types.Geocode]int{},
			catidx: map[types.Category]int{
				cat2a2: 0,
				cat2a3: 1,
			},
			totidx:  map[types.Category]int{},
			geos:    []types.Geocode{},
			cats:    cats,
			totcats: []types.Category{},
		}
		So(m, shouldBeEquivM, want)
	})

	Convey("New with totals initialises M correctly", t, func() {
		m, err := New(cats, true)
		So(err, ShouldBeNil)

		want := &M{
			tab:    [][]types.Value{},
			geoidx: map[types.Geocode]int{},
			catidx: map[types.Category]int{
				cat2a2: 0,
				cat2a3: 1,
			},
			totidx: map[types.Category]int{
				cat2a1: 2,
			},
			geos: []types.Geocode{},
			cats: cats,
			totcats: []types.Category{
				cat2a1,
			},
		}
		So(m, shouldBeEquivM, want)
	})
}

func Test_getRowIdx(t *testing.T) {
	Convey("Given an initialised M", t, func() {
		m, err := New(cats, false)
		So(err, ShouldBeNil)

		Convey("When new rows are added", func() {
			tests := []struct {
				geocode types.Geocode
				wantidx int
			}{
				{geoA, 0},
				{geoB, 1},
				{geoC, 2},
				{geoD, 3}, // deliberate repeats
				{geoA, 0},
				{geoB, 1},
				{geoC, 2},
				{geoD, 3},
			}

			for _, test := range tests {
				gotidx := m.getRowIdx(test.geocode)
				So(gotidx, ShouldEqual, test.wantidx)
			}

			Convey("the resulting M struct is correct", func() {
				want := &M{
					tab: [][]types.Value{
						{nan, nan},
						{nan, nan},
						{nan, nan},
						{nan, nan},
					},
					geoidx: map[types.Geocode]int{
						geoA: 0,
						geoB: 1,
						geoC: 2,
						geoD: 3,
					},
					catidx: map[types.Category]int{
						cat1: 0,
						cat2: 1,
					},
					totidx: map[types.Category]int{},
					geos: []types.Geocode{
						geoA,
						geoB,
						geoC,
						geoD,
					},
					cats:    cats,
					totcats: []types.Category{},
				}
				So(m, shouldBeEquivM, want)
			})
		})
	})
}

func Test_ImportCSV(t *testing.T) {
	Convey("Given an initialised M", t, func() {
		m, err := New(cats, false)
		So(err, ShouldBeNil)

		Convey("When a single-row CSV is imported", func() {
			records := [][]string{
				{"GeographyCode", "cat1"},
			}
			err := m.ImportCSV(records)
			Convey("error shoud be returned", func() {
				So(err.Error(), ShouldContainSubstring, "not enough rows")
			})
		})

		Convey("When a single-column CSV is imported", func() {
			records := [][]string{
				{"Geography Code"}, // also tests fuzzy (0,0) comparison
				{"geoA"},
			}
			err := m.ImportCSV(records)
			Convey("error should be returned", func() {
				So(err.Error(), ShouldContainSubstring, "not enough columns")
			})
		})

		Convey("When a non-metric file is imported", func() {
			records := [][]string{
				{"header1", "header2"},
				{"cell1", "cell2"},
			}
			err := m.ImportCSV(records)
			Convey("error should be returned", func() {
				So(err.Error(), ShouldContainSubstring, "not a metrics file")
			})
		})

		Convey("When a short row is found in the CSV", func() {
			records := [][]string{
				{"GeographyCode", "cat1"},
				{"geoA"},
			}
			err := m.ImportCSV(records)
			Convey("error should be returned", func() {
				So(err.Error(), ShouldContainSubstring, "should have")
			})
		})

		Convey("When a non-numeric value cell is in the CSV", func() {
			records := [][]string{
				{"GeographyCode", "cat1"},
				{"geoA", "this isn't a number"},
			}
			err := m.ImportCSV(records)
			Convey("error should be returned", func() {
				So(err.Error(), ShouldContainSubstring, "ParseFloat")
			})
		})

		Convey("When a duplicate CSV is imported", func() {
			records := [][]string{
				{"GeographyCode", "cat1", "cat3"},
				{"geoA", "1.2", "3.4"},
				{"geoC", "5.6", "7.8"},
			}
			err := m.ImportCSV(records)
			So(err, ShouldBeNil)
			Convey("second import should return error", func() {
				err := m.ImportCSV(records)
				So(err.Error(), ShouldContainSubstring, "duplicate")
			})
		})

		Convey("When a valid CSV is imported", func() {
			// these fields don't change
			catidx := map[types.Category]int{
				cat1: 0,
				cat2: 1,
			}
			totidx := map[types.Category]int{}
			totcats := []types.Category{}

			records := [][]string{
				{"GeographyCode", "cat1", "cat3"},
				{"geoA", "1.2", "3.4"},
				{"geoC", "5.6", "7.8"},
			}
			err := m.ImportCSV(records)
			Convey("no error should be returned", func() {
				So(err, ShouldBeNil)
			})
			Convey("correct table should be built", func() {

				want := &M{
					tab: [][]types.Value{
						{types.Value(1.2), nan},
						{types.Value(5.6), nan},
					},
					geoidx: map[types.Geocode]int{
						geoA: 0,
						geoC: 1,
					},
					catidx: catidx,
					totidx: totidx,
					geos: []types.Geocode{
						geoA,
						geoC,
					},
					cats:    cats,
					totcats: totcats,
				}
				So(m, shouldBeEquivM, want)
			})

			Convey("When a second valid CSV is imported", func() {
				records := [][]string{
					{" geography code ", "cat2", "cat4"},
					{"geoA", "9.1", "11.12"},
					{"geoB", "13.14", "15.16"},
					{"geoC", "NA", "19.2"},
				}
				err := m.ImportCSV(records)
				Convey("no error should be returned", func() {
					So(err, ShouldBeNil)
				})
				Convey("correct table should be built", func() {
					want := &M{
						tab: [][]types.Value{
							{types.Value(1.2), types.Value(9.1)},
							{types.Value(5.6), nan},
							{nan, types.Value(13.14)},
						},
						geoidx: map[types.Geocode]int{
							geoA: 0,
							geoB: 2,
							geoC: 1,
						},
						catidx: catidx,
						totidx: totidx,
						geos: []types.Geocode{
							geoA,
							geoC,
							geoB,
						},
						cats:    cats,
						totcats: totcats,
					}
					So(m, shouldBeEquivM, want)
				})
			})
		})
	})
}

func Test_mapGeos(t *testing.T) {
	Convey("Given an initialised M with an imported CSV", t, func() {
		m, err := New(cats, false)
		So(err, ShouldBeNil)

		records := [][]string{
			{"GeographyCode", "cat1", "cat2"},
			{"geoA", "1", "2"},
			{"geoB", "3", "4"},
		}
		err = m.ImportCSV(records)
		So(err, ShouldBeNil)

		Convey("empty geo list returns empty index", func() {
			idx := m.mapGeos(nil)
			So(len(idx), ShouldEqual, 0)
		})
		Convey("unknown geos are -1 in index", func() {
			idx := m.mapGeos([]types.Geocode{types.Geocode("geoZ")})
			So(idx, ShouldResemble, []int{-1})
		})
		Convey("known geos are indexed correctly", func() {
			idx := m.mapGeos([]types.Geocode{geoB, geoA})
			So(idx, ShouldResemble, []int{1, 0})
		})
	})
}

func Test_MakeTiles(t *testing.T) {
	Convey("Given an initialised M", t, func() {
		// initialise m with a 3 geos and 2 cats
		m, err := New( /*[]types.Geocode{geoA, geoB, geoN},*/ cats, false)
		So(err, ShouldBeNil)

		Convey("after importing a valid CSV", func() {
			// import a CSV that has a missing value
			records := [][]string{
				{"GeographyCode", "cat1", "cat2"},
				{"geoA", "1.2", "3.4"},
				{"geoB", "5.6", "7.8"},
				{"geoN", "9.1", "NaN"},
			}

			err := m.ImportCSV(records)
			So(err, ShouldBeNil)

			// Request tiles without any geos.
			// Should not be generated.
			Convey("empty geo list generates only headers", withTempDir(func(tmpdir string) {
				err := m.MakeTiles(nil, tmpdir)
				So(err, ShouldBeNil)
				err = diffr.CompareDirs(tmpdir, "testdata/tiles-0-geos")
				So(err, ShouldBeNil)
			}))

			// Request tiles with a single geo that exists in the table.
			// Should generate tiles with one geo each.
			Convey("single-geo list generates single data line", withTempDir(func(tmpdir string) {
				err := m.MakeTiles([]types.Geocode{geoA}, tmpdir)
				So(err, ShouldBeNil)
				err = diffr.CompareDirs(tmpdir, "testdata/tiles-1-geo")
				So(err, ShouldBeNil)
			}))

			// Request tiles with two geos that exist in the table.
			// Should generate tiles with both geos.
			Convey("two-geo list generates two data lines", withTempDir(func(tmpdir string) {
				err := m.MakeTiles([]types.Geocode{geoA, geoB}, tmpdir)
				So(err, ShouldBeNil)
				err = diffr.CompareDirs(tmpdir, "testdata/tiles-2-geos")
				So(err, ShouldBeNil)
			}))

			// Request tiles with a geo that does not exist in the table.
			// Existing geos should end up in csvs.
			Convey("missing geos are skipped", withTempDir(func(tmpdir string) {
				err := m.MakeTiles([]types.Geocode{geoA, geoB, geoC}, tmpdir)
				So(err, ShouldBeNil)
				err = diffr.CompareDirs(tmpdir, "testdata/tiles-3-geos")
				So(err, ShouldBeNil)
			}))

			// Request a tile with a geo that has a missing value for a category.
			// That geo should be skipped in the tile for the missing category.
			Convey("missing cells are skipped", withTempDir(func(tmpdir string) {
				err := m.MakeTiles([]types.Geocode{geoA, geoN}, tmpdir)
				So(err, ShouldBeNil)
				err = diffr.CompareDirs(tmpdir, "testdata/tiles-nan")
				So(err, ShouldBeNil)
			}))
		})
	})
}

func withTempDir(f func(dir string)) func() {
	return func() {
		dir, err := os.MkdirTemp("", "mktiles")
		So(err, ShouldBeNil)
		defer func() {
			if os.Getenv("TEST_KEEP_TMP") != "" {
				Printf("Test results are are in %s\n", dir)
			} else {
				os.RemoveAll(dir)
			}
		}()
		f(dir)
	}
}

func Test_tabrowsByType(t *testing.T) {
	// lookup function for a subset of the geos in m
	lookup := func(geocode types.Geocode) (types.Geotype, bool) {
		tbl := map[types.Geocode]types.Geotype{
			geoA: type1,
			geoB: type1,
			geoC: type2,
		}
		geotype, found := tbl[geocode]
		return geotype, found
	}

	Convey("Given an initialised M", t, func() {
		// set up a table with a geo that isn't found by lookup()
		m, err := New(cats, false)
		So(err, ShouldBeNil)

		records := [][]string{
			{"GeographyCode", "cat1"},
			{"geoA", "1"},
			{"geoB", "2"},
			{"geoC", "3"},
			{"geoN", "4"},
		}
		err = m.ImportCSV(records)
		So(err, ShouldBeNil)

		Convey("tabrowsByType categorises geos", func() {
			bytype := m.tabrowsByType(lookup)

			want := map[types.Geotype][]int{
				type1: []int{0, 1},
				type2: []int{2},
			}

			So(bytype, ShouldResemble, want)
		})
	})
}

func Test_MakeBreaks(t *testing.T) {
	lookup := func(geocode types.Geocode) (types.Geotype, bool) {
		tbl := map[types.Geocode]types.Geotype{
			geoA: type1,
			geoB: type1,
			geoC: type1,
			geoD: type1,
			geoE: type1,
			geoF: type1,
			geoG: type1,
			geoH: type2,
			geoI: type2,
			geoJ: type2,
			geoK: type2,
			geoL: type2,
			geoM: type2,
			geoN: type2,
		}
		geotype, found := tbl[geocode]
		return geotype, found
	}

	Convey("Given an initialised M", t, func() {
		//geos := []types.Geocode{geoA, geoB, geoC, geoD, geoE, geoF, geoG, geoH, geoI, geoJ, geoK, geoL, geoM, geoN}

		m, err := New( /*geos,*/ cats, false)
		So(err, ShouldBeNil)

		Convey("When a valid CSV is imported", func() {
			records := [][]string{
				{"GeographyCode", "cat1", "cat2"},
				{"geoA", "1", "15"},
				{"geoB", "2", "16"},
				{"geoC", "3", "17"},
				{"geoD", "4", "18"},
				{"geoE", "5", "19"},
				{"geoF", "6", "20"},
				{"geoG", "7", "21"},
				{"geoH", "8", "22"},
				{"geoI", "9", "23"},
				{"geoJ", "10", "24"},
				{"geoK", "11", "25"},
				{"geoL", "12", "26"},
				{"geoM", "13", "27"},
				{"geoN", "14", "28"},
			}
			err := m.ImportCSV(records)
			So(err, ShouldBeNil)

			Convey("correct breaks files should be produced", withTempDir(func(tmpdir string) {
				bdir := filepath.Join(tmpdir, "breaks")
				ckdir := filepath.Join(tmpdir, "ckbreaks")
				err := m.MakeBreaks(bdir, ckdir, lookup)

				Convey("no errors", func() {
					So(err, ShouldBeNil)
				})

				// diffr.CompareDirs doesn't follow subdirectories
				// so we have to compare directory by directory
				Convey("type1 breaks files correct", func() {
					err := diffr.CompareDirs(
						filepath.Join(bdir, "type1"),
						"testdata/breaks/type1",
					)
					So(err, ShouldBeNil)
				})
				Convey("type2 breaks files correct", func() {
					err := diffr.CompareDirs(
						filepath.Join(bdir, "type2"),
						"testdata/breaks/type2",
					)
					So(err, ShouldBeNil)
				})
				Convey("type1 ckbreaks files correct", func() {
					err := diffr.CompareDirs(
						filepath.Join(ckdir, "type1"),
						"testdata/ckbreaks/type1",
					)
					So(err, ShouldBeNil)
				})
				Convey("type2 ckbreaks files correct", func() {
					err := diffr.CompareDirs(
						filepath.Join(ckdir, "type2"),
						"testdata/ckbreaks/type2",
					)
					So(err, ShouldBeNil)
				})
			}))
		})
	})
}
