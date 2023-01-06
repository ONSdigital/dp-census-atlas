// Load and save version 1 content.json
package contentv1

import (
	"encoding/json"
	"fmt"
	"io"
	"sort"
)

type V1 struct {
	Content []Content `json:"content"`
}

// Content holds Topics
type Content struct {
	Topics []Topic `json:"topics"`
}

// Topics hold Variables
type Topic struct {
	Variables []Variable `json:"variables"`
}

// A Variable holds Classifications.
type Variable struct {
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
func Load(r io.Reader) (*V1, error) {
	buf, err := io.ReadAll(r)
	if err != nil {
		return nil, err
	}

	var v1 V1
	if err := json.Unmarshal(buf, &v1); err != nil {
		return nil, err
	}

	return &v1, nil
}

// Categories returns a list of the categories found in content.json as
// a slice of strings.
func (v1 *V1) Categories(classcode string) ([]string, error) {
	seen := map[string]bool{}
	for _, content := range v1.Content {
		for _, topic := range content.Topics {
			for _, variable := range topic.Variables {
				for _, class := range variable.Classifications {
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
func (v1 *V1) NamesToCats(classcode string, prefix string) (map[string]string, error) {
	catmap := map[string]string{}

	for _, content := range v1.Content {
		for _, topic := range content.Topics {
			for _, variable := range topic.Variables {
				for _, class := range variable.Classifications {
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
		}
	}
	return catmap, nil
}
