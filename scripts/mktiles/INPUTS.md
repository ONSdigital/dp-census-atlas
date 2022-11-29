# mktiles2 Input File Formats

This is a short description of the purpose and format of `mktiles2` input files.
All of these files should be in the same directory and passed to `mktiles2` with
the `-I` argument.

## geojson

The geojson files describe the geographic areas used by the Census Map.
There is a separate geojson file for each "layer".

`mktiles2` loads up to four geojson files in the input directory:

* lad.geojson	Local Authorities
* lsoa.geojson	Lower Layer Super Output Areas
* msoa.geojson	Middle Layer Super Output Areas
* oa.geojson	Output Areas

A message is printed if any are missing, but it's otherwise ok.

These files are standard geojson feature collection files with a feature for every
area.
For our purposes, each feature must include a standard set of properties as well
as a geometry or bounding box.

Internally year- and geotype-specific properties are mapped to a consistent set of
properties for easier processing.
The mapping is case-insensitive.
It goes like this:

|Property|Mapped to|
|---|---|
lad21cd|geocode
lad11cd|geocode
lad17cd|geocode
lsoa21cd|geocode
lsoa11cd|geocode
msoa21cd|geocode
msoa11cd|geocode
oa21cd|geocode
oa11cd|geocode
lad21nm|ename
lad11nm|ename
lad17nm|ename
lsoa21nm|ename
lsoa11nm|ename
msoa21nm|ename
msoa11nm|ename
oa21nm|ename
oa11nm|ename
lad21nmw|wname
lad11nmw|wname
lad17nmw|wname
lsoa21nmw|wname
lsoa11nmw|wname
msoa21nmw|wnmae
msoa11nmw|wname
oa21nmw|wname
oa11nmw|wname

In addition, a `geotype` property is set for each feature based on which file is being
processed.
So, for example, all features in `lad.geojson` are assigned geotype LAD.

This mapping happens in `geo/geo.go`.
Change the tables in that file to add more mappings.

If the feature doesn't already have a bounding box, one is calculated from the geometry.
A feature must have either a bounding box or a geometry.

The `go-geom` library is used to parse geojson.
See [go-geom/encoding/geojson](https://pkg.go.dev/github.com/twpayne/go-geom/encoding/geojson).

## MSOA names

If an `msoa.geojson` file is loaded, then `msoa-names.csv` will also be loaded.

`msoa-names.csv` maps MSOA geocodes to English and Welsh House of Commons place names
to replace the place names in `msoa.geojson`.

`msoa-names.csv` is a CSV file with a header line and a line for each MSOA geocode.
The columns used by `mktiles2` are:

	* `msoa11cd` or `msoa21cd` -- geocode
	* `msoa11hclnm` or `msoa21hclnm` -- House of Commons English name
	* `msoa21hclnmw` or `msoa21hclnmw` -- House of Commons Welsh name

Other columns are ignored.

If a geocode is missing from `msoa-names.csv`, or if an English or Welsh name is blank,
the corresponding MSOA name will not be changed.

If the Welsh name in `msoa-names.csv` is blank, the English name will be used.

Here is an example fragment of an `msoa-names.csv` file:

	msoa21cd,msoa21nm,msoa21nmw,msoa21hclnm,msoa21hclnmw,localauthorityname,type
	E02006534,Adur 001,Adur 001,Hillside,,Adur,Present in 2011

In this example, geocode `E02006534` will have its English name set to "Hillside".
The `msoa21hclnmw` column is blank, so the Welsh name will also be set to "Hillside".

The MSOA names processing happens in `geo/msoa_names.go`.

## Changing LAD geocodes

If a `lad.geojson` file is loaded and a `recode-lads.csv` file exists, then the geocodes
of some LADs will be changed.
(This was needed during the development of this program to make certain data comparable.)

`recode-lads.csv` looks like this:

	FromCode,ToCode
	E06000057,E06000048
	E07000240,E07000100
	E07000241,E07000104
	E07000242,E07000097
	E07000243,E07000101
	E08000037,E08000020

This file is probably not need for 2021 data.

The recoding happens in `geo/recode.go`.

## `content.json`

The `content.json` file is used heavily by the Census Map front end, but we use it only
to get a list of categories we want to extract from the metrics files (see below).
`mktiles2` parses the JSON and makes a list of category codes found.

Both the "old" and "new" versions of `content.json` are recognized, although the old
version probably isn't used now.

If the format of the `content.json` file changes, change its structure in
`content/content.go`.

## Grid file

The `DataTileGrid.json` file describes the bounding boxes of each tile we want to
produce data for.

The file looks like this:

	{
	  "lad": [
	    {
	      "tilename": "ew",
	      "bbox": {
	        "east": 1.76,
	        "north": 58.64,
	        "west": -7.57,
	        "south": 49.92
	      }
	    }
	  ],
 	  . . .
	}

The top level arrays are geotypes, and each element of the arrays is a tile.
So this is just a list of tiles by geotype.

The `tilename` is used in filenames, and the `bbox` coordinates are used when searching
for intersecting geographies from the geojson files.

## Metrics files

All files with a `.CSV` suffix are loaded as metrics files.
Metrics files are CSV tables holding numeric data for geocodes and categories.
Each row is for a geocode and each column is a category.
The column names are matched against the categories found in `content.json` (see above).
Individual cell values are opaque and have no meaning to `mktiles2`, but they have to be numeric.

Internally a single large table is made by combining all metrics files read.
This internal table has a row for every geocode found in the geojson files, and a column for
every category named in `content.json`.
As each metric file is read, its data is plugged into the appropriate cells in the internal table.

For a CSV to be recognized as a metrics file, it must have a header row, and the first column of
the header row must be `GeographyCode`.
Each row must have the same number of columns as the header row.
If a `.CSV` file is not a valid metrics file, a message is printed and the file is skipped.

Here is the top of an example metrics file with 2011 data:

	GeographyCode,QS604EW0001,QS604EW0002,QS604EW0003
	K04000001,26526336,7718656,2543578
	E92000001,25162721,7307083,2418518

The categories are the `QS*` columns and the geocodes are `K04000001` and `E92000001`.

`mktiles2` has the option of calculating Percentages.
This is a vestige of our development work with 2011 data.
Percentages only work with 2011 data because the category codes are regular enough that the totals
column can be determined.
The totals column is assumed be the one ending in `0001`.

When percentages are requested, the value of non-totals columns are replaced with their percentage
of the total.

So in the above table, the cell in the third column of the second row (7718656) would be replaced by
(29.098085766537829).
