package metric2

import (
	"errors"
	"fmt"
	"log"
	"math"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/jtrim-ons/ckmeans/pkg/ckmeans"

	"github.com/ONSdigital/dp-census-atlas/scripts/mktiles/files"
	"github.com/ONSdigital/dp-census-atlas/scripts/mktiles/types"
)

type M struct {
	// tab is the notional spreadsheet; rows are geos, cols are categories.
	// There are enough columns for regular categories and the optional
	// totals categories.
	// Each type of column is indexed separately (catidx, totidx).
	// Cells not loaded from metrics files are NaN.
	tab [][]types.Value

	// map geocodes to their row in tab
	geoidx map[types.Geocode]int

	// map cat names to cat codes
	doCatNameMatching bool
	namesToCats       map[string]string

	// map categories to their col in tab
	catidx map[types.Category]int

	// map totals categories to their col in tab
	totidx map[types.Category]int

	// geocodes in tab order
	geos []types.Geocode

	// categories and totals categories in tab order.
	cats    []types.Category
	totcats []types.Category

	// remember which metrics CSV held each category
	loadedCats map[types.Category]string
}

func New(cats []types.Category, withTots bool) (*M, error) {
	var err error
	totcats := []types.Category{}
	if withTots {
		totcats, err = guessTotalsCats(cats)
		if err != nil {
			return nil, err
		}
	}

	// allocate empty notional spreadsheet
	tab := [][]types.Value{}

	// create empty mapping from geocode to row number
	geoidx := map[types.Geocode]int{}

	// create mapping from category to column number
	catidx := map[types.Category]int{}
	for col, cat := range cats {
		catidx[cat] = col
	}

	// Create mapping from totals category to column number.
	// Totals categories are added to the right side of the
	// spreadsheet.
	totidx := map[types.Category]int{}
	for col, cat := range totcats {
		totidx[cat] = len(catidx) + col
	}

	return &M{
		tab:        tab,
		geoidx:     geoidx,
		catidx:     catidx,
		totidx:     totidx,
		geos:       []types.Geocode{},
		cats:       cats,
		totcats:    totcats,
		loadedCats: map[types.Category]string{},
	}, nil
}

func (m *M) LoadAll(dir, except string, doCatNameMatching bool, namesToCats map[string]string) error {
	fnames, err := filepath.Glob(filepath.Join(dir, "*.[cC][sS][vV]"))
	if err != nil {
		return err
	}

	for _, fname := range fnames {
		base := filepath.Base(fname)
		if strings.EqualFold(base, except) {
			log.Printf("skipping %s", fname)
			continue
		}
		log.Printf("Loading %s", fname)
		if err := m.Load(fname, doCatNameMatching, namesToCats); err != nil {
			return err
		}
	}
	return nil
}

func (m *M) Load(fname string, doCatNameMatching bool, namesToCats map[string]string) error {
	records, err := LoadCSV(fname)
	if err != nil {
		return err
	}
	return m.ImportCSV(fname, records, doCatNameMatching, namesToCats)
}

func (m *M) ImportCSV(fname string, records [][]string, doCatNameMatching bool, namesToCats map[string]string) error {
	var imported int

	if len(records) < 2 {
		return errors.New("not enough rows")
	}
	if len(records[0]) < 2 {
		return errors.New("not enough columns")
	}
	magic := strings.ReplaceAll(records[0][0], " ", "")
	if !strings.EqualFold(magic, "GeographyCode") {
		return errors.New("not a metrics file")
	}
	log.Printf("%d data rows in CSV\n", len(records)-1)

	for csvcol, colname := range records[0] {
		if csvcol == 0 {
			continue // skip GeographyCode column
		}

		var catcode string
		var ok bool
		if doCatNameMatching {
			catcode, ok = namesToCats[colname]
			if !ok {
				log.Printf("ignoring CSV col %q\n", colname)
				continue // this category not wanted
			}
		} else {
			catcode = colname
		}

		tabcol, ok := m.catidx[types.Category(catcode)]
		if !ok {
			tabcol, ok = m.totidx[types.Category(catcode)]
			if !ok {
				log.Printf("ignoring CSV col %q\n", catcode)
				continue // this category not wanted
			}
		}

		// check if we have seen this category before
		firstCSV, ok := m.loadedCats[types.Category(catcode)]
		if ok {
			return fmt.Errorf("duplicate category %s: seen in %s and %s", catcode, firstCSV, fname)
		} else {
			m.loadedCats[types.Category(catcode)] = fname
		}

		for csvrow, record := range records {
			if csvrow == 0 {
				continue // skip headers row
			}
			if len(record) != len(records[0]) {
				return fmt.Errorf("row %d: should have %d cols", csvrow, len(records[0]))
			}
			tabrow := m.getRowIdx(types.Geocode(record[0]))
			cur := m.tab[tabrow][tabcol]
			if !math.IsNaN(float64(cur)) {
				return fmt.Errorf("row %d: col %d: duplicate", csvrow, csvcol)
			}
			if record[csvcol] == "NA" {
				log.Printf("NA in row %d: col %d: skipping", csvrow, csvcol)
				continue // skip NA rows
			}
			v, err := strconv.ParseFloat(record[csvcol], 64)
			if err != nil {
				return fmt.Errorf("row %d: col %d: %w", csvrow, csvcol, err)
			}
			m.tab[tabrow][tabcol] = types.Value(v)
			imported++
		}
	}

	log.Printf("imported %d cells from CSV\n", imported)
	return nil
}

// getRowIdx returns the row index in m.tab for geocode.
// If geocode isn't already in m.tab, a row is created for it and filled with NaNs.
func (m *M) getRowIdx(geocode types.Geocode) int {
	// check if geocode is already in table
	rowidx, ok := m.geoidx[geocode]
	if ok {
		return rowidx
	}

	// create and initialise new row
	ncols := len(m.cats) + len(m.totcats)
	nan := types.Value(math.NaN())
	newrow := make([]types.Value, ncols)
	for col := 0; col < ncols; col++ {
		newrow[col] = nan
	}

	// add new row to m.tab
	m.tab = append(m.tab, newrow)

	// add this geocode to the geos list
	m.geos = append(m.geos, geocode)

	// add this geocode to geoidx
	rowidx = len(m.tab) - 1
	m.geoidx[geocode] = rowidx

	return rowidx
}

// MakeTiles creates data tile CSVs in dir.
func (m *M) MakeTiles(geos []types.Geocode, dir string) error {
	tabrows := m.mapGeos(geos)

	for cat, tabcol := range m.catidx {
		records := [][]string{
			{"geography_code", string(cat)},
		}

		found := false
		for i, geocode := range geos {
			tabrow := tabrows[i]
			if tabrow == -1 {
				//log.Printf("MakeTiles: %s: geocode not in table", geocode)
				continue
			}
			val := float64(m.tab[tabrow][tabcol])
			if math.IsNaN(val) {
				continue
			}
			cell := strconv.FormatFloat(val, 'g', 13, 64)
			records = append(records, []string{string(geocode), cell})
			found = true
		}

		fname := filepath.Join(dir, string(cat)+".csv")
		if !found {
			//log.Printf("%s: no matching geos; not creating", fname)
			continue
		}

		if err := files.SaveCSV(fname, records); err != nil {
			return err
		}
	}
	return nil
}

// mapGeos constructs a list of table row numbers corresponding to the geocodes in geos.
func (m *M) mapGeos(geos []types.Geocode) []int {
	idx := make([]int, len(geos))

	for i, geocode := range geos {
		tabrow, ok := m.geoidx[geocode]
		if !ok {
			tabrow = -1
		}
		idx[i] = tabrow
	}
	return idx
}

// stats describes a breaks file.
type stats map[types.Category]map[string][]float64

// A TypeLookupFunc is a function that returns the geotype of a given geocode.
type TypeLookupFunc func(types.Geocode) (types.Geotype, bool)

// MakeBreaks creates breaks json in dir.
func (m *M) MakeBreaks(dir, ckdir string, lookup TypeLookupFunc) error {
	rowsbytype := m.tabrowsByType(lookup)

	for _, cat := range m.cats {
		valsbytype := map[types.Geotype][]float64{}
		tabcol := m.catidx[cat]

		// construct slice of metric values for each geotype in this category
		for geotype, tabrows := range rowsbytype {
			for _, tabrow := range tabrows {
				val := float64(m.tab[tabrow][tabcol])
				if math.IsNaN(val) {
					//log.Printf("MakeBreaks: %s %s: NaN", cat, geotype)
					continue
				}
				valsbytype[geotype] = append(valsbytype[geotype], val)
			}
		}

		// calculate breaks and stats over each geotype's slice of values
		for geotype, vals := range valsbytype {
			if len(vals) == 0 {
				log.Printf("%s %s: no metrics", cat, geotype)
				continue
			}
			breaks, err := calcBreaks(vals, 5)
			if err != nil {
				return fmt.Errorf(
					"MakeBreaks: %s %s (%d values): %w",
					cat,
					geotype,
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
				return fmt.Errorf("breaks %s %s: %w", cat, geotype, err)
			}

			if err := saveStats(ckdir, geotype, cat, append([]float64{minmax[0]}, breaks...)); err != nil {
				return fmt.Errorf("ckbreaks %s %s: %w", cat, geotype, err)
			}
		}
	}

	return nil
}

// tabrowsByType returns a list of table row numbers for each geotype.
func (m *M) tabrowsByType(lookup TypeLookupFunc) map[types.Geotype][]int {
	res := map[types.Geotype][]int{}

	for tabrow, geocode := range m.geos {
		geotype, found := lookup(geocode)
		if !found {
			//log.Printf("tabrowsByType: geocode %s in metrics but not in geojson", geocode)
			continue
		}
		res[geotype] = append(res[geotype], tabrow)
	}
	return res
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
func saveStats(dir string, geotype types.Geotype, cat types.Category, result any) error {
	d := filepath.Join(dir, geotype.Pathname())
	if err := os.MkdirAll(d, 0755); err != nil {
		return err
	}

	name := filepath.Join(d, string(cat)+".json")

	return files.SaveJSON(name, true, result)
}
