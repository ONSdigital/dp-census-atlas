package main

import (
	"os"

	"github.com/ONSdigital/dp-census-atlas/scripts/s3sync/cli"
)

func main() {
	os.Exit(cli.CLI(os.Args[1:], cli.New))
}
