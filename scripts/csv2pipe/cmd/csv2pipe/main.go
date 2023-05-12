package main

import (
	"encoding/csv"
	"io"
	"log"
	"os"
	"strings"
)

func main() {
	r := csv.NewReader(os.Stdin)
	w := csv.NewWriter(os.Stdout)
	w.Comma = '|'

	var err error
	var row []string
	for {
		row, err = r.Read()
		if err != nil {
			break
		}
		for i, cell := range row {
			row[i] = escape(cell)
		}
		err = w.Write(row)
		if err != nil {
			break
		}
	}
	if err != nil && err != io.EOF {
		log.Fatal(err)
	}
	w.Flush()
	if err := w.Error(); err != nil {
		log.Fatal(err)
	}
}

func escape(s string) string {
	specials := []struct {
		from string
		to   string
	}{
		{"\\", `\\`},
		{"\n", `\n`},
		{"\r", `\r`},
		{"|", `\,`},
	}

	for _, special := range specials {
		s = strings.ReplaceAll(s, special.from, special.to)
	}
	return s
}
