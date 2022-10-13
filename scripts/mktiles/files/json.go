package files

import (
	"encoding/json"
	"os"
)

// SaveJSON writes data as a JSON file named fname.
// If pretty is true, the JSON will be formatted with 4-space indents.
// Otherwise, minified JSON will be saved.
func SaveJSON(fname string, pretty bool, data interface{}) (err error) {
	indent := ""
	if pretty {
		indent = "    "
	}
	buf, err := json.MarshalIndent(data, "", indent)
	if err != nil {
		return err
	}
	return os.WriteFile(fname, buf, 0644)
}
