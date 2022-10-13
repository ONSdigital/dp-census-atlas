package files

import (
	"encoding/csv"
	"os"
)

// SaveCSV writes records to a CSV file named fname.
func SaveCSV(fname string, records [][]string) (err error) {
	f, err := os.Create(fname)
	if err != nil {
		return
	}
	defer func() {
		err2 := f.Close()
		if err == nil {
			err = err2
		}
	}()

	w := csv.NewWriter(f)
	if err = w.WriteAll(records); err != nil {
		return
	}
	w.Flush()
	err = w.Error()
	return
}
