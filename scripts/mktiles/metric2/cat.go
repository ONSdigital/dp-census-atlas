package metric2

import (
	"errors"
	"fmt"
	"regexp"
	"sort"
	"strconv"

	"github.com/ONSdigital/dp-census-atlas/scripts/mktiles/types"
)

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

	// sort totcats for consistency
	less := func(i, j int) bool {
		return string(m.totcats[i]) < string(m.totcats[j])
	}
	sort.Slice(m.totcats, less)

	return nil
}

func guessTotalsCats(cats []types.Category) ([]types.Category, error) {
	seen := map[types.Category]bool{}

	for _, cat := range cats {
		totcat, err := GuessTotalsCat(cat)
		if err != nil {
			return nil, err
		}
		seen[totcat] = true
	}

	totcats := []types.Category{}

	for cat := range seen {
		totcats = append(totcats, cat)
	}

	// sort totcats for consistency
	less := func(i, j int) bool {
		return string(totcats[i]) < string(totcats[j])
	}
	sort.Slice(totcats, less)

	return totcats, nil
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

// MissingCats returns a list of categories named in content.json, but not found
// in any metrics CSV files.
func (m *M) MissingCats() []types.Category {
	missing := []types.Category{}
	for _, cat := range m.cats {
		_, ok := m.loadedCats[cat]
		if !ok {
			missing = append(missing, cat)
		}
	}
	for _, cat := range m.totcats {
		_, ok := m.loadedCats[cat]
		if !ok {
			missing = append(missing, cat)
		}
	}
	return missing
}
