// Load and save content.json
package content

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"os"
)

// Contents holds an old or new format content.json
type Content struct {
	old *oldContent
	new *newContent
}

// old structure of content.json
type oldContent struct {
	Meta        Meta         `json:"meta"`
	TopicGroups []TopicGroup `json:"content"`
}

// new structure of content.json
type newContent struct {
	Meta   Meta    `json:"meta"`
	Topics []Topic `json:"content"`
}

// Meta fields at the top of content.json.
// This may get out of sync as content.json evolves; it is really only here so we can
// write a complete json file for testing.
type Meta struct {
	FirstCreatedAt                      string `json:"first_created_at"`
	CantabularMetadataSource            string `json:"cantabular_metadata_source"`
	FilteredToAtlasContentAt            string `json:"filtered_to_atlas_content_at"`
	RichContentSpecFileUsedToFilter     string `json:"rich_content_spec_file_used_to_filter"`
	LegendStrsUpdatedAt                 string `json:"legend_strs_updated_at"`
	LegendStrsFileUsed                  string `json:"legend_strs_file_used"`
	PlaceholderVariablesDescsInsertedAt string `json:"placeholder_variable_descs_inserted_at"`
}

// A TopicGroup holds multiple Topics.
type TopicGroup struct {
	Name   string  `json:"name"`
	Slug   string  `json:"slug"`
	Desc   string  `json:"desc"`
	Topics []Topic `json:"topics"`
}

// A Topic holds multiple Variables.
type Topic struct {
	Name      string     `json:"name"`
	Slug      string     `json:"slug"`
	Desc      string     `json:"desc"`
	Variables []Variable `json:"variables"`
}

// A Variable holds multiple Classifications.
type Variable struct {
	Name            string           `json:"name"`
	Code            string           `json:"code"`
	Slug            string           `json:"slug"`
	Desc            string           `json:"desc"`
	Units           string           `json:"units"`
	Classifications []Classification `json:"classifications"`
}

// A Classification holds Categories.
type Classification struct {
	Code                        string     `json:"code"`
	Slug                        string     `json:"slug"`
	Desc                        string     `json:"desc"`
	ChoroplethDefault           bool       `json:"choropleth_default,omitempty"`
	DotDensityDefault           bool       `json:"dot_density_default,omitempty"`
	Comparison2011DataAvailable bool       `json:"comparison_2011_data_available"`
	Categories                  []Category `json:"categories"`
}

// Category holds the actual category codes and descriptions.
type Category struct {
	Name       string `json:"name"`
	Slug       string `json:"slug"`
	Code       string `json:"code"`
	LegendStr1 string `json:"legend_str_1"`
	LegendStr2 string `json:"legend_str_2"`
	LegendStr3 string `json:"legend_str_3"`
}

// Load an old or new format content.json file from an io.Reader.
func Load(r io.Reader) (*Content, error) {
	buf, err := io.ReadAll(r)
	if err != nil {
		return nil, err
	}

	new, err := newUnmarshal(buf)
	if err != nil {
		return nil, err
	}
	if new.isValid() {
		return &Content{
			new: new,
		}, nil
	}

	old, err := oldUnmarshal(buf)
	if err != nil {
		return nil, err
	}
	if len(old.TopicGroups) > 0 {
		return &Content{
			old: old,
		}, nil
	}

	return nil, errors.New("could not understand content.json")
}

// isValid is true if n holds a sensible new contents.json
func (n *newContent) isValid() bool {
	numVars := 0
	for _, topic := range n.Topics {
		numVars += len(topic.Variables)
	}
	return numVars > 0
}

// oldUnmarshal tries to unmarshal an old format content.json
func oldUnmarshal(buf []byte) (*oldContent, error) {
	var old oldContent
	if err := json.Unmarshal(buf, &old); err != nil {
		return nil, err
	}
	return &old, nil
}

// newUnmarshal tries to unmarshal a new format content.json
func newUnmarshal(buf []byte) (*newContent, error) {
	var new newContent
	if err := json.Unmarshal(buf, &new); err != nil {
		return nil, err
	}
	return &new, nil
}

// Load a content.json file by name.
func LoadName(name string) (*Content, error) {
	f, err := os.Open(name)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	return Load(f)
}

// Categories returns a list of the categories found in content.json as
// a slice of strings.
func (c *Content) Categories() []string {
	if c.new != nil {
		return c.newCategories()
	} else {
		return c.oldCategories()
	}
}

// Return list of categories in an old format content.json
func (c *Content) oldCategories() []string {
	var cats []string

	for _, group := range c.old.TopicGroups {
		for _, topic := range group.Topics {
			for _, variable := range topic.Variables {
				for _, classification := range variable.Classifications {
					for _, cat := range classification.Categories {
						cats = append(cats, cat.Code)
					}
				}
			}
		}
	}
	return cats
}

// Return list of categories in a new format content.json
func (c *Content) newCategories() []string {
	var cats []string

	for _, topic := range c.new.Topics {
		for _, variable := range topic.Variables {
			for _, classification := range variable.Classifications {
				for _, cat := range classification.Categories {
					cats = append(cats, cat.Code)
				}
			}
		}
	}
	return cats
}

// NamesToCats creates a map to lookup a category code given a category name.
// This is used when converting plain text headings in spreadsheets to specific
// category codes.
func (c *Content) NamesToCats(classcode string) (map[string]string, error) {
	if c.new != nil {
		return c.newNamesToCats(classcode)
	} else {
		return c.oldNamesToCats(classcode)
	}
}

// Return a name-to-category mapping from an old content.json
func (c *Content) oldNamesToCats(classcode string) (map[string]string, error) {
	catmap := map[string]string{}

	for _, group := range c.old.TopicGroups {
		for _, topic := range group.Topics {
			for _, variable := range topic.Variables {
				for _, classification := range variable.Classifications {
					if classification.Code != classcode {
						continue
					}
					for _, category := range classification.Categories {
						_, ok := catmap[category.Name]
						if ok {
							return nil, fmt.Errorf(
								"duplicate: %q",
								category.Name,
							)
						}
						catmap[category.Name] = category.Code
					}
				}
			}
		}
	}
	return catmap, nil
}

// Return a name-to-category mapping from a new content.json
func (c *Content) newNamesToCats(classcode string) (map[string]string, error) {
	catmap := map[string]string{}

	for _, topic := range c.new.Topics {
		for _, variable := range topic.Variables {
			for _, classification := range variable.Classifications {
				if classification.Code != classcode {
					continue
				}
				for _, category := range classification.Categories {
					_, ok := catmap[category.Name]
					if ok {
						return nil, fmt.Errorf(
							"duplicate: %q",
							category.Name,
						)
					}
					catmap[category.Name] = category.Code
				}
			}
		}
	}
	return catmap, nil
}
