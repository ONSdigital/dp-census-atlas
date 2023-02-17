package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
)

func main() {
	tab, err := Load(os.Stdin)
	if err != nil {
		log.Fatal(err)
	}

	vals, err := Extract(tab)
	if err != nil {
		log.Fatal(err)
	}

	breaks, err := Calc(vals, 5)
	if err != nil {
		log.Fatal(err)
	}

	buf, err := json.MarshalIndent(breaks, "", "    ")
	if err != nil {
		log.Fatal(err)
	}

	if _, err = fmt.Printf("%s\n", string(buf)); err != nil {
		log.Fatal(err)
	}
}
