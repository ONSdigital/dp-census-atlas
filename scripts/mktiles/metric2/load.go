package metric2

import (
	"encoding/csv"
	"os"

	"github.com/spkg/bom"
)

// loadCSV XXX move this to files pkg
func LoadCSV(fname string) ([][]string, error) {
	f, err := os.Open(fname)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	return csv.NewReader(bom.NewReader(f)).ReadAll()
}
