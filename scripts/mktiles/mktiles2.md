mktiles2(1) - General Commands Manual

# NAME

**mktiles2** - generate Census Atlas data files

# SYNOPSIS

**mktiles2**
\[**-c**&nbsp;*content.json*]
\[**-C**&nbsp;*classcode*]
\[**-M**]
\[**-P**&nbsp;*prefix*]
\[**-I**&nbsp;*indir*]
\[**-F**]
\[**-R**]
\[**-i**]
\[**-O**&nbsp;*outdir*]
\[**-f**]

# DESCRIPTION

**mktiles2**
generates data files used by the Census Atlas web application.
It loads census metrics, geographic data, and control files, then produces a set of files containing data in a structure usable by the Census Atlas.
**mktiles2**
recognises the following flags:

**-c** *content.json*

> Path to the
> *content.json*
> file.
> This defaults to
> *outdir*/`content.json`.

**-C** *classcode*

> Only use categories in
> *content.json*
> that are under the classification
> *classcode*.
> Normally all categories in under all classifications
> *content.json*
> will be used.

> Use this flag when category codes are duplicated in different classifications.

**-M**

> Match categories from input files based on name rather than code.

> Categories are selected from metrics input files when their column headings string match category codes in
> *content.json*.
> When
> **-M**
> is used, categories will be selected when their column headings match category names instead.

**-P** *prefix*

> When
> **-M**
> is used,
> *prefix*
> is prepended to category names found in
> *content.json*
> and then the prefix+catcode combination is matched against column headings in the metrics files.

> For example, the column headings in the metrics file might be like this
> '`2021 Value change: Household is not deprived in any dimension`',
> where they are prefixed with
> '`2021 Value change: `'.
> If
> *content.json*
> only names
> '`Household is not deprived in any dimension`',
> without the prefix, you can match these categories by providing a prefix to add to
> category names found in
> *content.json*.

**-I** *indir*

	Read input files from
	*indir*.
	Defaults to
	*./in/*.
	See below for the structure of the input directory.

**-F**

	Generate fake metrics.
	Instead of reading metrics files, generate random values.
	Values will be produced for all geographies in the loaded geojson files against all
	the categories found in
	*content.json*.

**-R**

	Produce ratios instead of metrics values.
	See
	*Calculating Ratios*
	below for how ratios are calculated.

**-i**

	Ignore missing categories in metrics files.
	Normally it is an error if a category is named in
	*content.json*
	but not found in any metrics files.
	With
	**-i**
	missing values will just be omitted from the output files.
	(If there is no category data for any of the geos for a tile, no data tile will be produced at all.)

**-O** *outdir*

	Output directory.
	Defaults to
	*./out/*.
	This directory will be created if it doesn't exist.
	See below for the structure of the output directory.

**-f**

	Force using an existing output directory even if it already has content.
	Normally it is an error if the output directory already contains any files or directories.

## Contents of the input directory

**mktiles2**
expects the input directory
*indir*
to contain a number of files.

Grid file

	The grid file
	*DataTileGrid.json*
	describes output tiles covering geographic areas.
	Features in geojson files which overlap these tiles will be included in the corresponding output data tiles.
	Each tile has a name and a bounding box, and tiles are grouped by level (LAD, LSOA, MSOA, OA).
	Here is an example snippet of a
	*DataTileGrid.json*
	file:

	> {
	>   "lad": [
	>     {
	>       "tilename": "ew",
	>       "bbox": {
	>         "east": 1.76,
	>         "north": 58.64,
	>         "west": -7.57,
	>         "south": 49.92
	>       }
	>     }
	>   ],
	>   "msoa": [
	>     {
	>       "tilename": "61-43-7",
	>       "bbox": {
	>         "east": -5.625,
	>         "north": 50.73645513701065,
	>         "west": -8.4375,
	>         "south": 48.922499263758255
	>       }
	>     },
	>   . . .

	Recognised geography levels are
	'`lad`',
	'`lsoa`',
	'`msoa`',
	and
	'`oa`'.
	The
	*bbox*
	values are latitude and longitude.

	In the example above, features within
	*msoa.geojson*
	which overlap the bounding box of MSOA tile
	'`61-43-7`'
	will be included in
	*tiles/msoa/61-43-7/**category*.csv.
	(See a full description of the output directory structure below.)

geojson files

	**mktiles2**
	expects at least one of the following geojson files to exist in
	*indir*:

	lad.geojson

	lsoa.geojson

	msoa.geojson

	oa.geojson

	These are standard geojson files.
	The name of the geojson files indicates the geographic level of features within the file.
	All features in
	*oa.geojson*
	will be considered OAs, for example.

	Each feature is expected to have certain standard properties indicating its geography code and place name.
	The expected properties vary by geographic level.

	The table below show which properties are required.
	Where multiple property names are shown, only one is needed.
	For example, only one of
	'`lad11nm`',
	'`lad17nm`',
	or
	'`lad21nm`'
	is needed to convey the English place name for features in
	*lad.geojson*.
	Property names are case-insensitive.

	> Geographic                English     Welsh  
	> level         geocode     name        name  
	> ----------    -------     --------    ---------  
	> LAD           lad11cd     lad11nm     lad11nmw        
	> lad17cd     lad17nm     lad17nmw        
	> lad21cd     lad21nm     lad21nmw                                
	> LSOA          lsoa11cd    lsoa11nm    lsoa11nmw       
	> lsoa21cd    lsoa21nm    lsoa21nmw                               
	> MSOA          msoa11cd    msoa11nm    msoa11nmw       
	> msoa21cd    msoa21nm    msoa21nmw                               
	> OA            oa11cd      oa11nm      oa11nmw         
	> oa21cd      oa21nm      oa21nmw

	Here is an example snippet showing a feature's properties.
	This is part of a
	*lad.geojson*
	file.
	The geographic code is
	'`E06000001`',
	and the English place name is
	'`Hartlepool`'.
	There isn't a Welsh place name, but there is a blank property.

	> {
	>   "type": "Feature",
	>   "properties": {
	>     "OBJECTID": 1,
	>     "LAD21CD": "E06000001",
	>     "LAD21NM": "Hartlepool",
	>     "LAD21NMW": " ",
	>     "BNG_E": 447160,
	>     "BNG_N": 531474,
	>     "LONG": -1.27018,
	>     "LAT": 54.67614,
	>     "GlobalID": "{A0067727-6C25-4D75-BBE3-839CF676A069}",
	>     "SHAPE_Length": 0.8685706369282687,
	>     "SHAPE_Area": 0.013064964649121342
	>   },
	>   "geometry": {
	>     "type": "MultiPolygon",
	>   . . .

	See
	*SEE ALSO*
	below for how to download geojson files from the Open Geography Portal.

MSOA names (optional)

	The place names in
	*msoa.geojson*
	as downloaded from the Open Geography Portal (see
	*SEE ALSO*
	below) are technical names and not necessarily common names.
	You can supply a mapping file to change the names to more common ones.

	The mapping file is a CSV with headers indicating the MSOA geography code and common names.
	In this mapping file, the columns may be in any order, and there may be extra columns which will be ignored.

	This table shows which columns convey which information:

	> Data                   CSV header  
	> -------------------    ----------------------------  
	> Geography code         msoa11cd or msoa21cd  
	> English common name    msoa11hclnm or msoa21hclnm  
	> Welsh common name      msoa11hclnmw or msoa21hclnmw

	For example, below are the first two lines of an MSOA names file.
	The first, fourth and fifth columns will be used to match common names to geography codes, and the rest of the columns will be ignored.

	> msoa21cd,msoa21nm,msoa21nmw,msoa21hclnm,msoa21hclnmw,localauthorityname,type
	> E02006534,Adur 001,Adur 001,Hillside,,Adur,Present in 2011

	See
	*SEE ALSO*
	below for a link to the House of Commons Library MSOA Names page where you can download
	*msoa-names.csv*.

LAD recodes (optional)

	Sometimes the geography codes in
	*lad.geojson*
	need to be mapped to different codes.
	In these cases, create
	*recode-lads.csv*
	to map old codes to new ones.
	This file should have a header line, and then a line for each recode, like this:

	> FromCode,ToCode
	> E06000057,E06000048

	In that example, when a feature with the geography code
	'`E06000057`'
	is loaded, its geography code will be changed to
	'`E06000048`',
	and metrics will match against
	'`E06000048`'.

content.json (may be elsewhere)

	The
	*content.json*
	file contains the categories that will be included in the output files.
	This file is used by the Census Maps application, so it has a lot more information than just categories.
	Categories (or category names) in this file are matched against category headings in metrics CSV files.

	There have been three versions of this file as Census Maps has developed.
	They differ in how deep the classification/category objects are nested.
	The main thing to know is that the classification/category relationship looks like this:

	> "classifications": [
	>   "code": "classification code",
	>   "categories": [
	>     {
	>       "name": "category name",
	>       "code": "category code",
	>     }
	>   ]
	> ]

	Depending on
	**-M**,
	either the category code or category name is matched against headings in metrics files.
	And when
	**-C** *classcode*
	is used, only categories within the classification code matching
	*classcode*
	will be used.

Metrics files

	All
	*.csv*
	files in
	*indir*,
	except for
	*msoa-names.csv*
	are loaded as metrics files.
	These are CSV files with headers, the first of which must be
	'`GeographyCode`'.
	All other columns may be matched to category codes or names from
	*content.json*,
	although any unreferenced columns are ignored.

	The
	'`GeographyCode`'
	column name is case-insensitive, and may include spaces, as in
	'`geography code`',
	and so on.

	Each line contains metrics for a single geography, whose code is in the first column.
	Here is an example:

	> GeographyCode,category1,category2
	> E06000057,0.5,0.75

## Structure of the output directory

**mktiles2**
produces a directory structure under
*outdir*
like this:

tiles (directory)

	The
	*tiles*
	directory holds "data tiles".
	These are small subsets of census data in a directory structure that matches the geographic level and tile name in
	*DataTileGrid.json*.
	The structure is

	> tiles/*level*/*tilename*/*category*.csv

	*category*
	comes from
	*content.json*.
	Every tile in
	*DataTileGrid.json*
	gets its own complete set of
	category files.

	These data tiles contain census data for a single category, and only include geographies from geojson that overlap the tile's bounding box.

	Here is an example file named
	*tiles/lad/ew/uk_armed_forces-001.csv*:

	> geography_code,uk_armed_forces-001
	> E06000001,4.1
	> E06000002,3
	> E06000003,4.9
	> E06000004,4
	> E06000005,4.9
	> E06000006,3.5
	> E06000007,3
	> E06000008,2.3
	> E06000009,4.2

	In the heading row, the first heading is always
	'`geography_code`',
	and the second heading is the category code.

	See
	*SEE ALSO*
	below for the location of downloadable metrics files.

breaks (directory)

	The
	*breaks*
	directory holds ckmeans breakpoints and min/max values.
	The structure is

	> breaks/*level*/*category*.json

	.

	*level*
	is the geographic level
	'`lad`',
	'`lsoa`',
	'`msoa`',
	or
	'`oa`'.
	*category*
	is the category code from
	*content.json*.
	Each geographic level directory will have a file for each category in
	*content.json*.
	Level directories will only be created when the corresponding geojson file is in
	*indir*.

	As an example, if
	*indir*
	contains
	*lad.geojson*
	and
	*msoa.geojson*,
	and
	*content.json*
	lists the
	'`uk_armed_forces-001`'
	and
	'`uk_armed_forces-002`'
	categories ,
	then the following four files will be produced:

	lad/uk_armed_forces-001.json

	lad/uk_armed_forces-002.json

	msoa/uk_armed_forces-001.json

	msoa/uk_armed_forces-002.json

	The metrics values for all geographies in each geographic level are included in the computations.

	Here is an example output file
	*breaks/lad/uk_armed_forces-001.json*:

	> {
	>     "uk_armed_forces-001": {
	>         "LAD": [
	>             1.5,
	>             2.7,
	>             3.9,
	>             6.2,
	>             11.1
	>         ],
	>         "LAD_min_max": [
	>             0.4,
	>             11.1
	>         ]
	>     }
	> }

breaksCkmeans (directory)

	The
	*breaksCkmeans*
	directory holds ckmeans breakpoints in a slightly different format than the ones in the
	*breaks*
	directory.
	*breaksCkmeans*
	files only hold the minimum value and the five breaks.
	This is how the same file used in the breaks example above looks in
	*breaksCkmeans*:

	> [
	>     0.4,
	>     1.5,
	>     2.7,
	>     3.9,
	>     6.2,
	>     11.1
	> ]

	The
	*breaksCkmeans*
	directory structure is the same as
	*breaks*.

geoLookup.json

	The
	*geoLookup.json*
	file is a listing of all geographies found in the geojson files.
	It is a json array of geographies that look like this:

	> {
	>     "en": "Hartlepool",
	>     "geoType": "LAD",
	>     "geoCode": "E06000001"
	> }

## Calculating Ratios

When
**-R**
is given on the command line, the output data tiles will contain ratios instead of values taken directly from the metrics files.
The ratio is the metric value divided by the total for that geography.

For example, if a line in the metrics file looks like this:

> GeographyCode,QS402EW0001,QS402EW0012,QS402EW0013,QS402EW0014
> E06000001,12,3,6,3

the ratio for
'`QS402EW0012`'
will be 3/12 (0.25).
Data tiles for the geography code
'`E06000001`'
and category
'`QS402EW0012`'
will have the value 0.25 (its ratio), not 3 (its value).

In order for this to work, category codes must fit a certain convention so
**mktiles2**
knows which column is the totals column.
Because the
**-R**
functionality was used during development with 2011 data, the convention follows 2011 category codes.
The convention for category codes is:

> *upper-case*+*digits*+*upper-case*+*final-digits*

Totals columns are those where
*final-digits*
has a value of 1, with any number of leading zeros.
For example,
'`QS402EW0001`'
is a totals category because the last numeric part has a value of 1.

## Operation

These are the processing steps
**mktiles2**
takes when producing output files.

1.	Load
	*content.json*  
	Category codes and names are extracted from
	*content.json*.
	If
	**-C**
	is used, then only the categories in the given classification will be extracted.  
	If
	**-M**
	is used, then an internal table is set up to map category names to codes.

2.	Load the grid file  
	Tiles from
	*DataTileGrid.json*
	are loaded.

3.	Set up notional spreadsheet  
	An internal table is set up with rows for geographies and columns for each category from
	*content.json*.
	This table will hold fake data, values loaded from metrics files, or ratios calculated from metrics files.

4.	Load metrics files  
	If we are not generating fake data, then metrics files are loaded.
	As each file is loaded, cells in the notional spreadsheet are populated with values from the file.
	Only cells from categories that have been extracted from
	*content.json*
	are loaded.
	Extra columns are ignored.

5.	Load geojson files  
	Optional MSOA renames and LAD recodes are applied while the geojson is loaded.  
	A bounding box is calculated for each feature that doesn't already have one.

6.	Generate geoLookup.json

7.	Generate fake data  
	If
	**-F**
	was given, fake data is generated for every cell in the notional spreadsheet.
	Each cell gets a random floating point value between 0 and 1.

8.	Calculate ratios
	If
	**-R**
	was given, then the cell contents of non-totals cells are recalculated as the ratio
	of their original value and the total value.
	See
	*Calculating Ratios*
	above.

9.	Generate data tiles  
	Data tiles are generated based on the bounding boxes from the Grid file and the
	bounding boxes of features in the geojson files.

10.	Generate breaks files

# FILES

## Input files

DataTileGrid.json

lad.geojson

lsoa.geojson

msoa.geojson

oa.geojson

msoa-names.csv

recode-lads.csv

content.json

*.csv

## Output files

tiles/level/tilename/category.csv

breaks/level/category.json

breaksCkmeans/level/category.json

geoLookup.json

# EXIT STATUS

The **mktiles2** utility exits0 on success, and>0 if an error occurs.

# SEE ALSO

[House of Commons Library MSOA Names](https://houseofcommonslibrary.github.io/msoanames/)

geojson files may be downloaded from the
[ONS Open Geography Portal](https://geoportal.statistics.gov.uk).
For LSOA, MSOA and OA files, go to "Boundaries" -> "Census Boundaries" and then select one of:

> LSOA    Lower Layer Super Output Areas  
> MSOA    Middle Layer Super Output Areas  
> OA      Output Areas

For LAD files, go to Boundaries -> Administrative Boundaries -> Local Authority Districts.

2011 metrics files may be downloaded from
[nomis](https://www.nomisweb.co.uk).
Follow "2011 Data Catalogue" -> "Bulk Download Products" and then either "Quick Statistics Bulk" or "Key Statistics Bulk".
You can then download a zip file which contains several CSV files.

2021 metrics files are not directly downloadable as yet.

macOS 12.6 - January 31, 2023
