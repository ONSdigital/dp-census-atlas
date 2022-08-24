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

### metadata files

- Ensure an up-to-date, unzipped archive of cantabular metadata files is placed in the `metadata_files` directory. At time of writing these can be found on sharepoint (here: [https://confluence.ons.gov.uk/display/ODADH/Upload+Metadata+Files+to+support+NOMIS%2C+Testing+etc](https://confluence.ons.gov.uk/display/ODADH/Upload+Metadata+Files+to+support+NOMIS%2C+Testing+etc)), e.g.
  [https://confluence.ons.gov.uk/download/attachments/77312931/ar2776-c21ew_metadata-v1-3_cantab_20220822-1.zip?api=v2](https://confluence.ons.gov.uk/download/attachments/77312931/ar2776-c21ew_metadata-v1-3_cantab_20220822-1.zip?api=v2), which should be unpacked to `metadata_files/ar2776-c21ew_metadata-v1-3_cantab_20220822-1`
- An index csv file defining the census content we want to use in the atlas, and how it will be visualised. These are manually made and stored in s3 - at the time of writing, [https://ons-dp-sandbox-atlas-input.s3.eu-west-2.amazonaws.com/working-content-files-backup/all-2021-atlas-content-index-2022-08-23.csv](https://ons-dp-sandbox-atlas-input.s3.eu-west-2.amazonaws.com/working-content-files-backup/all-2021-atlas-content-index-2022-08-23.csv) was up to date.

## How to use

### creating content.json files

- Ensure code dependencies are installed and metada files obtained and placed in the `metadata_files` directory.
- Ensure the virtual env is activated with `source env/bin/activate`
- To create a content.json file containing *all* content referenced in a cantabular metadata archive, run `./cantabular_metadata_to_content_json.py <path to unzipped cantabular metadata archive>`, e.g. `./cantabular_metadata_to_content_json.py metadata_files/ar2776-c21ew_metadata-v1-3_cantab_20220822-1`. This will create a content.json file in the `content_jsons` directory, named for the cantabular metadata directory is was created from, e.g. `content_jsons/ar2776-c21ew_metadata-v1-3_cantab_20220822-1-content.json`.
- To filter this large content.json file down to only content we want for the atlas, run `./filter_content_json_add_viz_flags.py <path to content json with all content> <path to index csv file defining which content we want>` e.g. `./filter_content_json_add_viz_flags.py content_jsons/ar2776-c21ew_metadata-v1-3_cantab_20220822-1-content.json metadata_files/all-2021-atlas-content-index-2022-08-23.csv`. This will create a content.json file in the `content_jsons` directory, named for the input content.json file with `atlas` and todays date added as suffixes, e.g. `content_jsons/ar2776-c21ew_metadata-v1-3_cantab_20220822-1-content-atlas-2022-08-24.json`. 

## validating content.json files

To check a filtered or manually edited content.json file has everything needed for the atlas, validate by invoking `validate_content_json_.py` with a reference to a content.json file, e.g. `./validate_content_json.py content_jsons/MY_CONTENT.json`. Validation issues will be printed to stdout.

### editing content.json legend strings

The census categories in the content.json files have two string properties that are hard to generate with code, and are not (AFAIK) supplied from elsewhere in the ONS - the legend strings. These are short sentence fragments that will be shown on the map legend to explain what is being shown for the currently selected area and census data (e.g. `50% of people in Hull are married`, if you have `Hull` and `marriage percentage` selected). These strings are generated
by `make_atlas_content_jsons.py` but should be manually reviewed and edited to ensure they are readable (clangers like `50% of households in Hull are walk to work` are commonly produced by the code).

To manually edit these strings, the content.json file itself can just be edited, but there are utility scripts to dump out the strings to csv to make it easier (and update content.json with the new strings from the csv file when you are finished).

To make a csv file from a given content.json, invoke `./content_json_legend_strs_to_csv.py` with a path to an input content.json file, e.g. `./content_json_legend_strs_to_csv.py demography-release-1-content.json`. This will create a csv file with a row for each category found in the input content.json file, e.g. `demography-release-1-content-legend-strs.csv`. The last three columns (called `EDIT_THIS_legend_str_1`, `EDIT_THIS_legend_str_2` and `EDIT_THIS_legend_str_3`) are the only ones that should be changed, all over columns (prefixed `ADMIN_`) are to keep track of which topic, variable and classification a category belongs to, and so should not be changed. The aim when editing is to make the last three columns of the csv make sense as a sentence.

When you have finished editing the legend strings in a csv file, to update a content.json with the new legend strings invoke `./update_content_json_legend_strs_from_csv.py` with a path to the content.json file to be updated and a path for the csv file with the new legend strings, e.g. `./update_content_json_legend_strs_from_csv.py demography-release-1-content.json demography-release-1-content-legend-strs.csv`.

### editing content.json variable description strings

The descriptions for variables that come from the cantabular metadata are often too long / detailed for the atlas UI. To manually edit these strings, the content.json file itself can just be edited, but there are utility scripts to dump out the variable descriptions to csv to make it easier (and update content.json with the new strings from the csv file when you are finished).

To make a csv file from a given content.json, invoke `./content_json_variable_desc_to_csv.py` with a path to an input content.json file and a path for the output file, e.g. `./content_json_variable_desc_to_csv.py demography-release-1-content.json`. This will create a csv file with a row for each category found in the input content.json file, e.g. `demography-release-1-content-variable-descs.csv`. The last column (called `EDIT_THIS_new_desc`) is the only one that should be changed, all over columns (prefixed `ADMIN_`) are to keep track of the topic the variable is in, and the original description for reference.

When you have finished editing the variable descs in a csv file, to update a content.json with the new variable descriptions invoke `./update_content_json_variable_desc_from_csv.py` with a path to the content.json file to be updated and a path for the csv file with the new variable descriptions strings, e.g. `./update_content_json_legend_strs_from_csv.py demography-release-1-content.json demography-release-1-content-variable-descs.csv`.

### listing census content in more readable csv files

Often a csv list of the variables, classifications etc is required to show other teams what the atlas uses. To dump all topics, variables or classifications from a content.json file to a csv file, run `./list_census_objects_in_content_json.py <path to content.json> <census object to list>`, e.g. `./list_census_data.py content_jsons/all-2021-content-2022-08-23.json variable`. This will create a .csv file listing all the object type you asked for, in the directory that you invoked the file from, named for the input content.json file with suffixes for object type and the date it was produced, e.g. `ar2776-c21ew_metadata-v1-3_cantab_20220822-1-content-atlas-2022-08-24-all-variable-2022-08-24.csv`.

### Misc (ToDo, document these properly)

- `update_old_json_to_new.py` updates an old legacy-format content.json file to the latest format.
- `content_json_to_excel.py` creates an excel file in the (approximate) format of the `Output_Category_Mapping_2021.xlsx` that was doing the rounds.
- `split_content_json_by_release.py` is WIP but will divide an input content.json into seperate files, each relating to a specific data release.
