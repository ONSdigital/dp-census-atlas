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
- if you want to run the tests, you will need to `pip install -r dev-requirements.txt`

### running unit tests

- Ensure code dependencies are setup and the virtual env is activated
- Invoke tests with `python -m pytest tests`

## How to use

### Quickstart to make new content.json

1. Ensure code dependencies are installed
2. Download latest cantabular metadata archive from https://confluence.ons.gov.uk/pages/viewpage.action?spaceKey=ODADH&title=Upload+Metadata+Files+to+support+NOMIS%2C+Testing+etc
3. Unzip cantabular metadata into a new directory within `input_metadata_files`
4. Copy the `content-spec-example.json` to a new file (e.g. `my-content-spec.json`), and (minimally) fill in the bits with `CHANGE ME`:
   * Change the value for `cantabular_metadata_dir` to the name of the unzipped cantabular metadata archive you added to `input_metadata_files` in step 2.
   * Change the value for `version` to something that describes the content you're about to make (e.g. `My-New-Content`). This will go in the filenames, file metadata and the output path.
5. Run `make_content_jsons.py`against your content-spec sheet, e.g. `./make_content_jsons.py my-content-spec.json`. This will output content json files to `output_content_jsons/<value of version in spec file>`,
e.g `output_content_jsons/My-New-Content/`. There will be one content json for every topic specified in the rich content spec csv, with another one (`ALL`) containing all topics specified. 


### Changing the atlas content

The master list for the classifications used in the atlas is found in the Rich content product specifications table on confluence, [here](https://confluence.ons.gov.uk/display/ODADH/Rich+content+product+specifications). If this has been updated, export it as csv and save over `input_metadata_files/Rich_content_product_specifications.csv` before re-running `make_content_json.py`.