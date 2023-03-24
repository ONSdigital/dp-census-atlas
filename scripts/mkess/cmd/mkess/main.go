package main

import (
	"encoding/csv"
	"flag"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"strconv"

	"github.com/gosimple/slug"
	"github.com/jszwec/csvutil"

	"github.com/ONSdigital/dp-census-atlas/scripts/mkess/content"
	"github.com/ONSdigital/dp-census-atlas/scripts/mkess/dataset"
	"github.com/ONSdigital/dp-census-atlas/scripts/mkess/taxonomy"
)

// Map geocode prefixes to geotypes.
var geotypes = map[string][]string{
	"E12": []string{"RGN"},
	"N92": []string{"RGN"},
	"S92": []string{"RGN"},
	"W92": []string{"RGN"},
	"E06": []string{"LTLA", "UTLA"},
	"E07": []string{"LTLA"},
	"E08": []string{"LTLA", "UTLA"},
	"E09": []string{"LTLA", "UTLA"},
	"E10": []string{"UTLA"},
	"N09": []string{"LTLA", "UTLA"},
	"S12": []string{"LTLA", "UTLA"},
	"W06": []string{"LTLA", "UTLA"},
}

// requiredPrefixes lists geocode prefixes that are required to be within
// a geotype.
// ds.TrimGeotypes removes geotypes that do not have the required prefixes.
// The key in the requiredPrefixes map is a geotype, and the value is a
// slice of required prefixes.
var requiredPrefixes = map[string][]string{
	"LTLA": {"E07"},
	"UTLA": {"E10"},
}

// These are the only geotypes we want in ess_content.json.
// Order here counts.
// This order will be seen in the Map.
// The available_geographies key in ess_content.json will have
// matching members in this order.
var contentGeotypes = []string{"RGN", "UTLA", "LTLA"}

func main() {
	outdir := flag.String("O", "", "output directory")
	baseurl := flag.String("u", "", "base URL for data tiles and ckmeans files")
	taxpath := flag.String("t", "", "path to taxonomy.json")
	flag.Usage = func() {
		fmt.Fprintf(flag.CommandLine.Output(), "Usage: %s -O <outdir> -u <baseurl> < input.csv\n", os.Args[0])
		flag.PrintDefaults()
	}
	flag.Parse()
	if *outdir == "" || *baseurl == "" || *taxpath == "" {
		flag.Usage()
		os.Exit(2)
	}

	taxonomy, err := taxonomy.Load(*taxpath)
	if err != nil {
		log.Fatal(err)
	}

	// Row describes the rows of the spreadsheet.
	// The column headings are named in the struct tags.
	// These column headings must exactly match the headings in the spreadsheet.
	type Row struct {
		AreaCode  string `csv:"AREACD"`
		AreaName  string `csv:"AREANM"`
		Geography string `csv:"Geography"`
		Indicator string `csv:"Indicator"`
		Category  string `csv:"Category"`
		Period    string `csv:"Period"`
		Measure   string `csv:"Measure"`
		Unit      string `csv:"Unit"`
		Value     string `csv:"Value"`
		MAD       string `csv:"MAD"`
	}

	// Set up csv reader expecting the first line as the header line.
	dec, err := csvutil.NewDecoder(csv.NewReader(os.Stdin))
	if err != nil {
		log.Fatal(err)
	}

	// Set up DataSet to accumulate Indicators and Values
	ds := dataset.New()

	line := 1 // accounts for header line
	for {
		line++

		// read the next row
		var row Row
		if err := dec.Decode(&row); err == io.EOF {
			break
		} else if err != nil {
			log.Fatalf("line %d: %s", line, err)
		}

		// skip explicit NA values
		if row.Value == "NA" {
			continue
		}

		// but error on any other non-numeric value
		val, err := strconv.ParseFloat(row.Value, 64)
		if err != nil {
			log.Fatalf("line %d: value %q: %s", line, row.Value, err)
		}

		// map Geography to geocode
		geotypes := geocode2geotypes(row.AreaCode)
		if len(geotypes) == 0 {
			continue
		}

		// append this value to the appropriate indicator
		ind, err := ds.FindIndicator(
			row.Indicator,
			row.Period,
			row.Measure,
			row.Unit,
		)
		if err != nil {
			log.Fatalf("line %d: %s", line, err)
		}
		for _, geotype := range geotypes {
			ind.AppendMetric(geotype, row.AreaCode, val)
		}
	}

	// remove geotypes that do not have any geocodes with the required prefixes
	for geotype, prefixes := range requiredPrefixes {
		for _, prefix := range prefixes {
			ds.TrimGeotypes(geotype, prefix)
		}
	}

	if err := ds.WriteTiles(*outdir); err != nil {
		log.Fatal(err)
	}

	if err := genContent(filepath.Join(*outdir, "ess_content.json"), taxonomy.Topics, ds, *baseurl); err != nil {
		log.Fatal(err)
	}
}

// genContent generates the ess_content.json file.
// The structure comes from topics, and the data comes from ds.
func genContent(fname string, topics []taxonomy.Topic, ds *dataset.DataSet, baseurl string) error {
	cont := content.New("ESS data test")
	for _, topic := range topics {
		vg := content.NewVariableGroup(
			topic.Name,
			dataset.ZapSpecial(topic.Name),
			slug.Make(topic.Name),
		)

		nind := 0
		for _, taxind := range topic.Indicators {
			iname := taxind.Name
			ind, ok := ds.Indicators[iname]
			if !ok {
				log.Printf("Indicator %q not found in spreadsheet", iname)
				continue
			}
			geotypes := availableGeotypes(ind)
			if len(geotypes) == 0 {
				log.Printf("Indicator %q has no geotypes for ess_content.json", iname)
				continue
			}
			vg.NewCategory(
				iname,
				taxind.LongDesc,
				dataset.ZapSpecial(iname),
				slug.Make(iname),
				ind.Unit,
				ind.Measure,
				baseurl,
				geotypes,
			)
			nind++
		}
		// The Census Maps app doesn't like empty variable groups in content.json files.
		if nind == 0 {
			log.Printf("Topic %q has no qualifying indicators", topic.Name)
		} else {
			cont.AppendVariableGroup(vg)
		}

	}
	return cont.Save(fname)
}

// availableGeotypes returns the list of geotypes in an Indicator which are
// also in contentGeotypes.
func availableGeotypes(ind *dataset.Indicator) []string {
	var result []string
	for _, wanttype := range contentGeotypes {
		for geotype := range ind.Metrics {
			if geotype == wanttype {
				result = append(result, geotype)
				break
			}
		}
	}
	return result
}

// geocode2geotypes returns the set of geotypes we want geocode to fall into.
// An empty set means we are not interested in this geocode.
func geocode2geotypes(geocode string) []string {
	if len(geocode) != 9 {
		return nil
	}
	return geotypes[geocode[0:3]]
}
