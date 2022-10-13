# mktiles

## What does mktiles do?

The mktiles program generates data files for use by the Census Maps application:

* data tiles
* breaks files
* `geoLookup.json`

Inputs are:

* geojson files describing geographic features
* metrics files containing category measurements against geography codes
* `content.json`
* grid file
* MSOA names file
* optional LAD recoding file

The program does the following:

1. reads geojson files, extracts geocodes, Feature names, bounding boxes, and so on
    1. applies House of Commons names to MSOA features
    2. assigns standard property names within each Feature (eg “geocode”)
    3. optionally recodes LAD geocodes (2017 -> 2011)
2. generates `geoLookup.json` for LADs and MSOAs
3. loads `content.json` and extracts its category list
4. loads metrics files and extracts desired category values (if Ratios are required, totals categories are also extracted and ratios are calculated here)
5. loads the grid file to get the bounding boxes for each map tile
6. generates data tiles for each quad in the grid file
7. generates breaks files for every category in `content.json`

Output files are placed in a known structure in the output directory.
These output files can be used by the Census Map application locally, or they can be transferred to a web-server.

## How to build the binary

Build the binary like this:

	cd <repo>/mktiles
	go build ./cmd/mktiles/…

You will be left with a `mktiles` or `mktiles.exe` file in the *repo*/`mktiles` directory.

## What input files need to be gathered

The programs reads all input files from a single input directory.

The following files must be present in the input directory:

* `content.json`
* `DataTileGrid.json`
* geojson files named after their geography type (`lad.geojson`, `lsoa.geojson`, `msoa.geojson`, `oa.geojson`)
* `msoa-names.csv`
* `recode-lads.csv` (optional)
* metrics files named `*.CSV`

`content.json` is the master list of categories we are interested in.
If a category is not named in `content.json`, then it will be ignored when the metrics files are read.
The exception to this is that when Ratios are required, “totals” categories are also loaded so that the ratio of value/total can be calculated.

`DataTileGrid.json` holds all the quads we want to build data tiles for.
This is a list of named bounding boxes grouped by geography type. Data tiles will be generated for each quad.

The geojson files hold the boundaries of each feature of the given type.
For example, the `oa.geojson` file contains the boundaries of every Output Area. Metadata about each feature is held in the Feature’s Properties. The bounding box of the Feature is calculated on load if it isn’t already included in the geojson.

`msoa-names.csv` holds the House of Commons names for Features within `msoa.geojson`.
When `msoa.geojson` is loaded, existing Feature names are replaced with values from `msoa-names.csv`.

`recode-lads.csv` is optional.
It is only used to change the geocodes on certain features in `lad.geojson`.
This is only used for 2011 data because the `lad.geojson` file we have is from 2017 and certain geocodes were changed between 2011 and 2017.

Actual census data is in the `*.CSV` files.
These files have a row for each geocode and a column for each category.
Only categories that match the ones in `content.json` are used.

## Where to get input files

### `content.json`

The `content.json` file we have been using for 2011 processing is located in `examples/content-2011.json`.
If you want to run 2011 processes, copy this file to `content.json` in your input directory.

The current `content.json` for 2021 processing is located elsewhere in this repo XXX.

### `DataTileGrid.json`

The `DataTileGrid.json` file we have been using so far is in `examples/DataTileGrid.json`.
Copy this to your input directory.

### geojson files

The 2011 geojson files are in an S3 bucket. Download these using the AWS cli:

(Use sandbox credentials)

	prefix=s3://ons-dp-sandbox-atlas-input/geojson

	aws s3 cp "$prefix/Local_Authority_Districts_(December_2017)_Boundaries_in_the_UK_(WGS84).geojson" lad.geojson

	aws s3 cp "$prefix/Lower_Layer_Super_Output_Areas_(December_2011)_Boundaries_Super_Generalised_Clipped_(BSC)_EW_V3.geojson" lsoa.geojson

	aws s3 cp "$prefix/Middle_Layer_Super_Output_Areas_(December_2011)_Boundaries_Super_Generalised_Clipped_(BSC)_EW_V3.geojson" msoa.geojson

	aws s3 cp "$prefix/Output_Areas__December_2011__Boundaries_EW_BGC.geojson" oa.geojson

The 2021 geojson files are downloaded from the geoportal.

	base=https://opendata.arcgis.com/api/v3/datasets

	curl "$base/1782872283f648828142036f3b213fb3_0/downloads/data?format=geojson&spatialRefId=4326&where=1%3D1" > lad.geojson

	curl "$base/38255434eb54456cbd202f54fddfe5c9_0/downloads/data?format=geojson&spatialRefId=4326&where=1%3D1" > msoa.geojson

	curl "$base/5670c14a21224d8187357a095121ca39_0/downloads/data?format=geojson&spatialRefId=4326&where=1%3D1" > oa.geojson

(The LAD geodata is found by:
1. Go to https://geoportal.statistics.gov.uk/datasets/ons::local-authority-districts-december-2021-gb-bgc/about
2. Select Download
3. Select GeoJSON
)

### `msoa-names.csv`

For 2011:

	curl https://houseofcommonslibrary.github.io/msoanames/MSOA-Names-1.16.csv > msoa-names.csv

For 2021:

	curl https://houseofcommonslibrary.github.io/msoanames/MSOA-Names-2.0.csv > msoa-names.csv

### `recode-lads.csv`

For 2011, copy this file from `examples/` to your input directory.

### metrics files

For 2011 metrics, download the following zip files from `https://www.nomisweb.co.uk/output/census/2011`

	ks103ew_2011_oa.zip
	ks202ew_2011_oa.zip
	ks206ew_2011_oa.zip
	ks207wa_2011_oa.zip
	ks608ew_2011_oa.zip
	qs101ew_2011_oa.zip
	qs103ew_2011_oa.zip
	qs104ew_2011_oa.zip
	qs113ew_2011_oa.zip
	qs119ew_2011_oa.zip
	qs201ew_2011_oa.zip
	qs202ew_2011_oa.zip
	qs203ew_2011_oa.zip
	qs208ew_2011_oa.zip
	qs301ew_2011_oa.zip
	qs302ew_2011_oa.zip
	qs303ew_2011_oa.zip
	qs402ew_2011_oa.zip
	qs403ew_2011_oa.zip
	qs406ew_2011_oa.zip
	qs411ew_2011_oa.zip
	qs415ew_2011_oa.zip
	qs416ew_2011_oa.zip
	qs501ew_2011_oa.zip
	qs601ew_2011_oa.zip
	qs604ew_2011_oa.zip
	qs605ew_2011_oa.zip
	qs701ew_2011_oa.zip
	qs702ew_oa.zip
	qs803ew_2011_oa.zip

Each zip file has a file named `*DATA.CSV`, among other files.
Extract each zip and copy the `*DATA.CSV` file into the input directory.

For 2021 metrics, we don’t have any real data yet.

## How to run the binary

When all the required files are in the input directory, you can run the binary.

Usage is like this:

	./mktiles [-I <input-dir>] [-R] [-F] [-O <output-dir>]

`-I` is the input directory which holds all the files described above.
This is `./in` by default, but you can use anything convenient.

`-R` means “calculate ratios”.
When `-R` is given, “totals” categories are also read from the metrics files, and each value is replaced with value/total.
This only makes sense with 2011 data where category codes are consistent and totals categories are known.
2021 input metrics are already ratios, so `-R` is not needed.

`-F` means “generate fake metrics”.
When `-F` is given, metrics files are not loaded, and the values for each category are randomly generated.
This is being used for development before real-looking 2021 data is available.

`-O` is the output directory where all output files will go.
This directory must be empty or must not exist at all.
If you stop a run midway, you will have to remove the output directory yourself before re-running the program.

So, assuming default input and output directories, you could do this for 2011:

	./mktiles -R

and this for 2021 fake data:

	./mktiles -F

## Notional Spreadsheet

The underlying principle beneath this processing is a Notional Spreadsheet.
Every row is a geography, and every column is a Category.
Cells are filled in as metrics files are loaded.
When data tiles are generated, subsets of this Notional Spreadsheet are written to individual files.

The mktiles program attaches no meaning to the values in cells, except when it has to calculate Ratios.
So a category column may contain whole numbers such as populations, or floating point values that represent percentags or any other calculation.

Each data tile has a bounding box defined in `DataTileGrid.json`.
Rows of the Notional Spreadsheet are selected when the row’s geography intersects the tile’s bounding box. Then a file is created for every column.

For example, here is a simplified Notional Spreadsheet:

	geocode		cat1	cat2	cat3
	geo1		1		2		3
	geo2		4		5		6
	geo3		7		8		9

The “real” spreadsheet would have a column for every category named in `content.json`, and a row for every Feature in all the geojson files.

For a data tile named “tile1” whose bounding box intersects geo1 and geo3, the following files would be produced:

`out/tiles/`*geotype*`/tile1/cat1.csv`:

	geography_code,cat1
	geo1,1
	geo3,7

`out/tiles/`*geotype*`/tile1/cat2.csv`:

	geography_code,cat2
	geo1,2
	geo3,8

`out/tiles/`*geotype*`/tile1/cat3.csv`:
	geography_code,cat3
	geo1,3
	geo3,9
