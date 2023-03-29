# ESS Tiles

This directory holds the scripts used to generate data tiles for the experimental ESS version of Census Maps.

## Input and output files

Input consists of two files:

* `data.csv`
* `taxonomy.json`

Output is a directory holding data tiles and breaks usable by the ESS app.
This directory should be uploaded to S3 (see the `Makefile` `dryrun` and `push` targets).

`data.csv` is a spreadsheet with the data to be displayed in the ESS demo.
It should have the following columns:

	AREACD|AREANM|Geography|Indicator|Category|Period|Measure|Unit|Value|MAD

It is up to you to find the spreadsheet.
Put the CSV in this directory, then create a symlink named `data.csv` pointing to the real CSV.

`taxonomy.json` defines the structure of the Topics and Indicators seen in the ESS demo.
An example taxonomy file is in this directory.

## Analysing data in the spreadsheet

The `Makefile` has targets to list unique categories and indicators found in the input CSV, and there are targets to convert the CSV into pipe-delimited files to make it easier for standard unix tools.

For example, `make head.pipe` will create a file with just the CSV headings, separated by pipes.
And make categories shows how the pipe-delimited version of the CSV can be used as input to `awk`.

See the `Makefile` for more examples.

## Generating tile data

Run `make ESS2` to generate a directory holding tile and breaks data from `data.csv` and `taxonomy.json`.

## Pushing tile data to S3

Run `make dryrun` to see what would change when you push to S3.
It's a good idea to try dryrun first to make sure your AWS credentials work, and to verify what will change on S3 when you do the real push.

Run `make push` to actually do the push.
