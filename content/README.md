# Atlas content file generation

## Overview

Utility scripts for making and editing content.json files for consumption by the atlas. These files hold the census metadata the atlas needs to fetch and display census data.

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

### running unit tests

- Ensure code dependencies are setup and the virtual env is activated
- Invoke tests with `python -m pytest tests`

### metadata files

- Ensure an up-to-date, unzipped archive of cantabular metadata files is placed in the `metadata_files` directory. At time of writing these can be found on sharepoint (here: [https://confluence.ons.gov.uk/display/ODADH/Upload+Metadata+Files+to+support+NOMIS%2C+Testing+etc](https://confluence.ons.gov.uk/display/ODADH/Upload+Metadata+Files+to+support+NOMIS%2C+Testing+etc)), e.g.
  [https://confluence.ons.gov.uk/download/attachments/77312931/ar2776-c21ew_metadata-v1-3_cantab_20220822-1.zip?api=v2](https://confluence.ons.gov.uk/download/attachments/77312931/ar2776-c21ew_metadata-v1-3_cantab_20220822-1.zip?api=v2), which should be unpacked to `metadata_files/ar2776-c21ew_metadata-v1-3_cantab_20220822-1`
- Ensure a JSON file defining the custom variable groups for the atlas is available locally, e.g. [https://confluence.ons.gov.uk/download/attachments/107087117/Atlas_Variable_Groups.json?api=v2](https://confluence.ons.gov.uk/download/attachments/107087117/Atlas_Variable_Groups.json?api=v2)
- Ensure a CSV file exported from the rich content spec table (here: [https://confluence.ons.gov.uk/display/ODADH/Rich+content+product+specifications](https://confluence.ons.gov.uk/display/ODADH/Rich+content+product+specifications)) is available locally.

## How to use

### creating content.json files

- Ensure code dependencies are installed, an archive of cantabular metadata has been extracted in the `metadata_files` directory, and other required files are available locally.
- Ensure the virtual env is activated with `source env/bin/activate`.
- To create a content.json file, run `./cantabular_metadata_to_atlas_content.py metadata_files/<unzipped cantabular metadata archive> <path to variable groups json> <-22-09-02.csv`, e.g. `./cantabular_metadata_to_atlas_content.py metadata_files/ar2776-c21ew_metadata-v1-3_cantab_20220826-1 metadata_files/Atlas_Variable_Groups.json metadata_files/rich-content-spec-22-09-02.csv`
- To create a content.json file containing *all* content referenced in a cantabular metadata archive, run `./cantabular_metadata_to_content_json.py <path to unzipped cantabular metadata archive>`, e.g. `./cantabular_metadata_to_atlas_content.py metadata_files/ar2776-c21ew_metadata-v1-3_cantab_20220826-1 metadata_files/Atlas_Variable_Groups.json metadata_files/rich-content-spec-22-09-02.csv`. This will create a content.json file in the `content_jsons` directory, named `all-atlas-content-<datetime of creation>.json`.

## validating content.json files

To check a filtered or manually edited content.json file has everything needed for the atlas, validate by invoking `validate_content_json_.py` with a reference to a content.json file, e.g. `./validate_content_json.py content_jsons/MY_CONTENT.json`. Validation issues will be printed to stdout.

### editing content.json legend strings

The census categories in the content.json files have two string properties that are hard to generate with code, and are not (AFAIK) supplied from elsewhere in the ONS - the legend strings. These are short sentence fragments that will be shown on the map legend to explain what is being shown for the currently selected area and census data (e.g. `50% of people in Hull are married`, if you have `Hull` and `marriage percentage` selected). These strings are generated
by `make_atlas_content_jsons.py` but should be manually reviewed and edited to ensure they are readable (clangers like `50% of households in Hull are walk to work` are commonly produced by the code).

To manually edit these strings, the content.json file itself can just be edited, but there are utility scripts to dump out the strings to csv to make it easier (and update content.json with the new strings from the csv file when you are finished).

To make a csv file from a given content.json, invoke `./legend_strs_to_csv.py` with a path to an input content.json file, e.g. `./legend_strs_to_csv.py demography-release-1-content.json`. This will create a csv file with a row for each category found in the input content.json file, e.g. `demography-release-1-content-legend-strs.csv`. The last three columns (called `EDIT_THIS_legend_str_1`, `EDIT_THIS_legend_str_2` and `EDIT_THIS_legend_str_3`) are the only ones that should be changed, all over columns (prefixed `ADMIN_`) are to keep track of which variable group, variable and classification a category belongs to, and so should not be changed. The aim when editing is to make the last three columns of the csv make sense as a sentence.

When you have finished editing the legend strings in a csv file, to update a content.json with the new legend strings invoke `./update_legend_strs_from_csv.py` with a path to the content.json file to be updated and a path for the csv file with the new legend strings, e.g. `./update_legend_strs_from_csv.py demography-release-1-content.json demography-release-1-content-legend-strs.csv`.

### editing content.json variable description strings



### listing census content in more readable csv files

Often a csv list of the variables, classifications etc is required to show other teams what the atlas uses. To dump all topics, variables or classifications from a content.json file to a csv file, run `./list_census_content_json.py <path to content.json> <census object to list>`, e.g. `./list_census_content_json.py content_jsons/all-2021-content-2022-08-23.json variable`. This will create a .csv file listing all the object type you asked for, in the directory that you invoked the file from, named for the input content.json file with suffixes for object type and the date it was produced, e.g. `ar2776-c21ew_metadata-v1-3_cantab_20220822-1-content-atlas-2022-08-24-all-variable-2022-08-24.csv`.

### Misc (ToDo, document these properly)

- `make_2011_test_content.py` randomly assigns 2011 categories to all categories in an input content.json - useful for testing new variables that don't have data available yet
- `sub_long_variable_descs.py` replace long variable descs with shorter lorem ipsum text - stopgap until the new shorter variable descs are available.
