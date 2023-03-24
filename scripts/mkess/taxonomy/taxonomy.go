package taxonomy

import (
	"encoding/json"
	"os"
)

type Taxonomy struct {
	Topics []Topic `json:"topics"`
}

// The Topic->Indicators hierarchy defines the structure of ess_content.json.
// Topics become the top level VariableGroups and Indicators become
// Variables/Classifications/Categories.
// See category.New() for how Indicators are set up within content.json Variables.
type Topic struct {
	Name       string       `json:"name"`
	Indicators []*Indicator `json:"indicators"`
}

type Indicator struct {
	Name     string `json:"name"`
	LongDesc string `json:"longdesc"`
}

func Load(fname string) (*Taxonomy, error) {
	var tax Taxonomy

	buf, err := os.ReadFile(fname)
	if err != nil {
		return nil, err
	}

	if err := json.Unmarshal(buf, &tax); err != nil {
		return nil, err
	}

	return &tax, nil
}
