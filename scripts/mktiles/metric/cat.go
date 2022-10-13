package metric

import (
	"encoding/csv"
	"errors"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"regexp"
	"strconv"

	"github.com/ONSdigital/dp-census-atlas/scripts/mktiles/types"
)

// LoadAll loads metrics CSV files from dir.
// Only wanted and totals categories will be kept.
func (m *M) LoadAll(dir string) error {
	m.tab = make(Table)

	fnames, err := filepath.Glob(filepath.Join(dir, "*.CSV"))
	if err != nil {
		return err
	}

	for _, fname := range fnames {
		log.Printf("Loading %s", fname)
		csv, err := loadCatfile(fname)
		if err != nil {
			return err
		}

		if len(csv) < 2 {
			log.Printf("skipping %s: not enough rows", fname)
			continue
		}
		if len(csv[0]) < 2 {
			log.Printf("skipping %s: not enough columns", fname)
			continue
		}
		if csv[0][0] != "GeographyCode" {
			log.Printf("skipping %s: not a metrics file", fname)
			continue
		}

		for coln, catcode := range csv[0] {
			if coln == 0 {
				continue // geo column
			}
			if !m.wantCat(types.Category(catcode)) {
				continue // not interested in this category
			}
			m.tab[types.Category(catcode)] = map[types.Geocode]types.Value{}
			for rown, row := range csv {
				if rown == 0 {
					continue // headers row
				}
				if len(row) < len(csv[0]) {
					return fmt.Errorf("%s: row %d: not enough columns", fname, rown)
				}
				v, err := strconv.ParseFloat(row[coln], 64)
				if err != nil {
					return fmt.Errorf("%s: row %d: col %d: %w", fname, rown, coln, err)
				}
				m.tab[types.Category(catcode)][types.Geocode(row[0])] = types.Value(v)
			}
		}
	}
	return nil
}

// IncludeTotalCats figures out totals categories we will also need to load.
func (m *M) IncludeTotalCats() error {
	totcats := map[types.Category]bool{}

	for _, cat := range m.cats {
		totcat, err := GuessTotalsCat(cat)
		if err != nil {
			return err
		}
		totcats[totcat] = true
	}

	for cat := range totcats {
		m.totcats = append(m.totcats, cat)
	}
	return nil
}

// loadCatfile loads a single category CSV.
func loadCatfile(fname string) ([][]string, error) {
	f, err := os.Open(fname)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	return csv.NewReader(f).ReadAll()
}

var catRegex = regexp.MustCompile(`^([A-Z]+)([0-9]+)([A-Z]+)([0-9]+)$`)

// GuessTotalsCat figures out the category holding totals.
// So far this means just changing the numeric part to 1.
// "QS402EW0012" --> "QS402EW0001"
func GuessTotalsCat(cat types.Category) (types.Category, error) {
	matches := catRegex.FindStringSubmatch(string(cat))
	if len(matches) != 5 {
		return "", errors.New("can't parse category code")
	}

	n, err := strconv.Atoi(matches[4])
	if err != nil {
		return "", err
	}

	if n == 1 {
		return "", errors.New("category is already the totals category")
	}

	digits := len(matches[4])
	s := fmt.Sprintf("%s%s%s%0*d", matches[1], matches[2], matches[3], digits, 1)
	return types.Category(s), nil
}

// wantCat is true if catcode is in m.cats or m.totcats
func (m *M) wantCat(catcode types.Category) bool {
	for _, c := range m.cats {
		if c == catcode {
			return true
		}
	}
	for _, c := range m.totcats {
		if c == catcode {
			return true
		}
	}
	return false
}

// WantCats adds the categories in cats to the list of categories we are
// interested in.
func (m *M) WantCats(cats []string) {
	for _, cat := range cats {
		m.cats = append(m.cats, types.Category(cat))
	}
}
