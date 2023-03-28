package main

import (
	"encoding/csv"
	"flag"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strconv"

	"github.com/gosimple/slug"
	"github.com/jszwec/csvutil"
)

// Map Geography fields in the spreadsheet to geography codes in the topo file.
// An empty code here will cause the corresponding spreadsheet rows to be skipped.
// Geography strings must exactly match the strings found in the spreadsheet.
var geotypes = map[string]string{
	"Combined Authority or City Region": "CAUTH",
	"Country":                           "CTRY",
	"County or Unitary Authority":       "UTLA",
	"ITL Level 1":                       "ITL1",
	"ITL Level 2":                       "ITL2",
	"ITL Level 3":                       "ITL3",
	"Local Authority District":          "LTLA",
	"Nation":                            "",
	"Police Force Area":                 "",
	"Region":                            "RGN",
	"Welsh Health Board":                "",
}

// These are the only geotypes we want in ess_content.json.
var contentGeotypes = []string{"RGN", "LTLA", "UTLA"}

// The Topic->Indicators hierarchy defines the structure of ess_content.json.
// Topics become the top level VariableGroups and Indicators become
// Variables/Classifications/Categories.
// See NewCategory() for how Indicators are set up within content.json Variables.
type Topic struct {
	Name       string
	Indicators []string
}

// These Indicators in the spreadsheet are not used in currently selected Topics:
//
//	Aged 16 to 64 years level 3 or above qualifications
//	Aged 19 years and over further education and skills learner achievements
//	Employment rate for 16 to 64 year olds
//	Gross disposable household income per head
//
// The other Indicators in the spreadsheet are placed within Topics.
// The Indicator strings must exactly match the strings found in the spreadsheet.
var topics = []Topic{
	{
		Name: "Business",
		Indicators: []string{
			"Total value of UK exports",
			"Inward foreign direct investment (FDI)",
			"Outward foreign direct investment (FDI)",
		},
	},
	{
		Name: "Digital",
		Indicators: []string{
			"Gigabit capable broadband",
			"4G coverage",
		},
	},
	{
		Name: "Education and skills",
		Indicators: []string{
			"Pupils at expected standards by end of primary school",
			"GCSEs (and equivalent) in English and maths by age 19",
			"Schools and nursery schools rated good or outstanding",
			"Persistent absences for all pupils",
			"Persistent absences for pupils eligible for free school meals",
			"Persistent absences for pupils looked after by local authorities",
			"Children at expected standard for communication and language by end of early years foundation stage",
			"Children at expected standard for literacy by end of early years foundation stage",
			"Children at expected standard for maths by end of early years foundation stage",
			"Apprenticeships starts",
			"Apprenticeships achievements",
			"Aged 19 years and over further education and skills participation",
		},
	},
	{
		Name: "Health and wellbeing",
		Indicators: []string{
			"Female healthy life expectancy",
			"Male healthy life expectancy",
			"Cigarette smokers",
			"Overweight children at reception age (aged four to five years)",
			"Overweight children at Year 6 age (aged 10 to 11 years)",
			"Overweight adults (aged 18 years and over)",
			"Cancer diagnosis at stage 1 and 2",
			"Cardiovascular mortality considered preventable in persons aged under 75",
			"Life satisfaction",
			"Feeling life is worthwhile",
			"Happiness",
			"Anxiety",
		},
	},
	{
		Name: "Housing",
		Indicators: []string{
			"Additions to the housing stock",
		},
	},
	{
		Name: "Income and pay",
		Indicators: []string{
			"Gross value added per hour worked",
			"Gross median weekly pay",
		},
	},
	{
		Name: "Transport",
		Indicators: []string{
			"Public transport or walk to employment centre with 500 to 4999 jobs",
			"Drive to employment centre with 500 to 4999 jobs",
			"Cycle to employment centre with 500 to 4999 jobs",
		},
	},
	{
		Name: "Crime and justice",
		Indicators: []string{
			"Homicide Offences",
		},
	},
	{
		Name: "Devolution",
		Indicators: []string{
			"Population under devolution deal in England",
		},
	},
}

func main() {
	outdir := flag.String("O", "", "output directory")
	baseurl := flag.String("u", "", "base URL for data tiles and ckmeans files")
	flag.Usage = func() {
		fmt.Fprintf(flag.CommandLine.Output(), "Usage: %s -O <outdir> -u <baseurl> < input.csv\n", os.Args[0])
		flag.PrintDefaults()
	}
	flag.Parse()
	if *outdir == "" || *baseurl == "" {
		flag.Usage()
		os.Exit(2)
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
	ds := NewDataSet()

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
		geotype, ok := geotypes[row.Geography]
		if !ok {
			log.Fatalf("line %d: %q: unrecognised geography", line, row.Geography)
		}
		if geotype == "" {
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
		ind.AppendMetric(geotype, row.AreaCode, val)
	}

	if err := ds.WriteTiles(*outdir); err != nil {
		log.Fatal(err)
	}

	if err := genContent(filepath.Join(*outdir, "ess_content.json"), ds, *baseurl); err != nil {
		log.Fatal(err)
	}
}

// genContent generates the ess_content.json file.
// The structure comes from topics, and the data comes from ds.
func genContent(fname string, ds *DataSet, baseurl string) error {
	cont := NewContent("ESS data test")
	for _, topic := range topics {
		vg := NewVariableGroup(
			topic.Name,
			ZapSpecial(topic.Name),
			slug.Make(topic.Name),
		)

		nind := 0
		for _, iname := range topic.Indicators {
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
				ZapSpecial(iname),
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
func availableGeotypes(ind *Indicator) []string {
	var result []string
	for geotype := range ind.Metrics {
		for _, wanttype := range contentGeotypes {
			if geotype == wanttype {
				result = append(result, geotype)
				break
			}
		}
	}
	sort.Strings(result) // sort for output consistency
	return result
}
