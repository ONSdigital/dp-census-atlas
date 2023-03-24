package content

import (
	"encoding/json"
	"os"
)

// These Content related structs describe the format of ess_content.json
// as expected by the Maps app.
type Content struct {
	Meta    Meta             `json:"meta"`
	Content []*VariableGroup `json:"content"`
}

type Meta struct {
	Release string `json:"release"`
}

type VariableGroup struct {
	Name      string      `json:"name"`
	Code      string      `json:"code"`
	Slug      string      `json:"slug"`
	Desc      string      `json:"desc"`
	Variables []*Variable `json:"variables"`
}

type Variable struct {
	Name            string            `json:"name"`
	Code            string            `json:"code"`
	Slug            string            `json:"slug"`
	Desc            string            `json:"desc"`
	LongDesc        string            `json:"long_desc"`
	Units           string            `json:"units"`
	TopicCode       string            `json:"topic_code"`
	BaseURL2021     string            `json:"base_url_2021"`
	Classifications []*Classification `json:"classifications"`
}

type Classification struct {
	Code              string      `json:"code"`
	Slug              string      `json:"slug"`
	Desc              string      `json:"desc"`
	AvailableGeotypes []string    `json:"available_geotypes"`
	ChoroplethDefault bool        `json:"choropleth_default"`
	DotDensityDefault bool        `json:"dot_density_default"`
	Categories        []*Category `json:"categories"`
}

type Category struct {
	Code    string `json:"code"`
	Slug    string `json:"slug"`
	Name    string `json:"name"`
	Legend1 string `json:"legend_str_1"`
	Legend2 string `json:"legend_str_2"`
	Legend3 string `json:"legend_str_3"`
}

func New(release string) *Content {
	return &Content{
		Meta: Meta{
			Release: release,
		},
	}
}

// NewVariableGroup sets up a new top level variable group (Topic).
func NewVariableGroup(name, code, slug string) *VariableGroup {
	return &VariableGroup{
		Name: name,
		Code: code,
		Slug: slug,
	}
}

// AppendVariableGroup adds a VariableGroup to a Content struct.
func (cont *Content) AppendVariableGroup(vg *VariableGroup) {
	cont.Content = append(cont.Content, vg)
}

// NewCategory creates the Variable/Classification/Category structure in ess_content.json
// for a single Indicator.
// The structure of content.json has more hierarchical levels than we need for ESS.
// So we fill each level with the same Indicator fields.
func (vg *VariableGroup) NewCategory(name, code, slug, units, legend, baseurl string, geotypes []string) {
	v := &Variable{
		Name:        name,
		Code:        code,
		Slug:        slug,
		Desc:        "",
		LongDesc:    name,
		Units:       units,
		BaseURL2021: baseurl,
		Classifications: []*Classification{
			{
				Code:              code,
				Slug:              slug,
				Desc:              name,
				AvailableGeotypes: geotypes,
				ChoroplethDefault: true,
				DotDensityDefault: true,
				Categories: []*Category{
					{
						Name:    name,
						Slug:    slug,
						Code:    code,
						Legend1: legend,
					},
				},
			},
		},
	}

	vg.Variables = append(vg.Variables, v)
}

// Save writes out a nes ess_content.json file.
func (cont *Content) Save(fname string) error {
	tmpname := fname + ".tmp"

	w, err := os.Create(tmpname)
	if err != nil {
		return err
	}
	enc := json.NewEncoder(w)
	enc.SetIndent("", "    ")
	if err := enc.Encode(cont); err != nil {
		w.Close()
		return err
	}
	if err := w.Close(); err != nil {
		return err
	}
	return os.Rename(tmpname, fname)
}
