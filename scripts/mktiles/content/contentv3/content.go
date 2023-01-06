// Load and save version3 content.json
package contentv3

import (
	"encoding/json"
	"fmt"
	"io"
	"sort"
)

type V3 struct {
	Content []Content `json:"content"`
}

// Content holds Classifications.
type Content struct {
	Classifications []Classification `json:"classifications"`
}

// A Classification holds Categories.
type Classification struct {
	Code       string     `json:"code"`
	Categories []Category `json:"categories"`
}

// Category holds the actual category codes and descriptions.
type Category struct {
	Name string `json:"name"`
	Code string `json:"code"`
}

// Load content.json file from an io.Reader.
func Load(r io.Reader) (*V3, error) {
	buf, err := io.ReadAll(r)
	if err != nil {
		return nil, err
	}

	var v3 V3
	if err := json.Unmarshal(buf, &v3); err != nil {
		return nil, err
	}

	return &v3, nil
}

// Categories returns a list of the categories found in content.json as
// a slice of strings.
func (v3 *V3) Categories(classcode string) ([]string, error) {
	seen := map[string]bool{}
	for _, content := range v3.Content {
		for _, class := range content.Classifications {
			if classcode != "" && class.Code != classcode {
				continue
			}
			for _, cat := range class.Categories {
				if seen[cat.Code] {
					return nil, fmt.Errorf("duplicate: %q", cat.Code)
				}
				seen[cat.Code] = true
			}
		}
	}
	cats := []string{}
	for cat, _ := range seen {
		cats = append(cats, cat)
	}
	sort.Strings(cats) // for repeatability
	return cats, nil
}

// NamesToCats creates a map to lookup a category code given a category name.
// This is used when converting plain text headings in spreadsheets to specific
// category codes.
func (v3 *V3) NamesToCats(classcode string, prefix string) (map[string]string, error) {
	catmap := map[string]string{}

	for _, content := range v3.Content {
		for _, class := range content.Classifications {
			if classcode != "" && class.Code != classcode {
				continue
			}
			for _, cat := range class.Categories {
				_, ok := catmap[cat.Name]
				if ok {
					return nil, fmt.Errorf("duplicate: %q", cat.Name)
				}
				catmap[prefix+cat.Name] = cat.Code
			}
		}
	}
	return catmap, nil
}
