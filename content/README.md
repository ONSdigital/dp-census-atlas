# Atlas content file generation

## Overview

Utility scripts for making and editing content.json files for consumption by the atlas. These files hold the census metadata the atlas needs to fetch
and display census data. Each content.json file represents a census data release.

## Requirements

- Python >= 3.10
- python dependencies as listed in `requirements.txt`

## Getting started

### code dependencies

- Ensure you are using Python >= 3.10 (developed on 3.10.3, may work on earlier versions but hasn't been tested)
- cd into this directory (`/content`)
- make virtual env with `python3 -m venv env` (NB may just be `python -m venv env` if you use pyenv or similar)
- activate virtual env with `source env/bin/activate`
- install requirements with `pip install -r requirements.txt`

### metadata files

- Ensure up-to-date versions of the cantabular metadata files `Topic.csv`, `Variable.csv` and `Classification.csv` are placed in the `metadata_files` directory. At time of writing these can be found on sharepoint (here: [https://confluence.ons.gov.uk/display/ODADH/Upload+Metadata+Files+to+support+NOMIS%2C+Testing+etc](https://confluence.ons.gov.uk/display/ODADH/Upload+Metadata+Files+to+support+NOMIS%2C+Testing+etc)), within zip archives, e.g.
  [https://confluence.ons.gov.uk/download/attachments/77312931/d_ar2776-c21ew_metadata-v1-1_cantab_20220527-1.zip?api=v2](https://confluence.ons.gov.uk/download/attachments/77312931/d_ar2776-c21ew_metadata-v1-1_cantab_20220527-1.zip?api=v2)
- A copy of the latest annotated Output_Category_Mapping excel file will be needed - probably best to talk to Ahmad (ahmad.barclay@ons.gov.uk) or Viv (vivian.allen@methods.co.uk) if you're unsure where to get this.

## How to use

### creating content.json files

- Ensure code dependencies are installed and metada files obtained and placed in the `metadata_files` directory.
- To create content.json files for each data release defined in the `Release` column on the `Index-filtered` sheet of the annotated Output_Category_Mapping excel file (NB column name and sheet name _may_ have changed since time of writing), invoke `make_atlas_content_jsons.py` with a reference to the annotated Output_Category_Mapping excel file, e.g. `./make_atlas_content_jsons.py metadata_files/MY_OUTPUT_CATEGORY_MAPPING.xlsx`
- This will create `content.json` files (one for each release defined in the `Release` column) in the `content_jsons` directory.

## validating content.json files

The `make_atlas_content_jsons.py` script checks that the metadata defined for each releases are complete and valid before saving, and so should not produce any broken json files.
Files that have been manually edited subsequently (see editing content.json legend strings, below) should be re-validated. This can be done by invoking `validate_content_json_.py` with a reference to a content.json file, e.g. `./validate_content_json.py content_jsons/MY_CONTENT.json`.

### editing content.json legend strings

The census categories in the content.json files have two string properties that are hard to generate with code, and are not (AFAIK) supplied from elsewhere in the ONS - the legend strings. These are short sentence fragments that will be shown on the map legend to explain what is being shown for the currently selected area and census data (e.g. `50% of people in Hull are married`, if you have `Hull` and `marriage percentage` selected). These strings are generated
by `make_atlas_content_jsons.py` but should be manually reviewed and edited to ensure they are readable (clangers like `50% of households in Hull are walk to work` are commonly produced by the code).

To manually edit these strings, the content.json file itself can just be edited, but there are utility scripts to dump out the strings to csv to make it easier (and update content.json with the new strings from the csv file when you are finished).

To make a csv file from a given content.json, invoke `./content_json_legend_strs_to_csv.py` with a path to an input content.json file and a path for the output file, e.g. `./content_json_legend_strs_to_csv.py demography-release-1-content.json demography-release-1-content-legend-strs.csv`. This will create a csv file with a row for each category found in the input content.json file. The last two columns (called `EDIT_THIS_legend_str_1` and `EDIT_THIS_legend_str_2`) are the only ones that should be changed, all over columns (prefixed `ADMIN_`) are to keep track of which topic, variable and classification a category belongs to, and so should not be changed. The aim when editing is to make the last three columns of the csv make sense as a sentence.

When you have finished editing the legend strings in a csv file, to update a content.json with the new legend strings invoke `./update_content_json_legend_strs_from_csv.py` with a path to the content.json file to be updated and a path for the csv file with the new legend strings, e.g. `./update_content_json_legend_strs_from_csv.py demography-release-1-content.json demography-release-1-content-legend-strs.csv`.
