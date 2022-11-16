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
4. Copy the latest `2021-content-spec-vXX.json` to a new file, iterating `XX` to a new version number. Minimally change the `cantabular_metadata_dir` value to point at the new unzipped metadata archive made in step 2. See `2021-content-spec-example.json` for guidance.
5. Run `make_content_jsons.py`against your content-spec sheet, e.g. `./make_content_jsons.py 2021-content-spec-vXXX.json`. This will output content json files to `output_content_jsons/2021`. There will be one content json for every topic specified in the Atlas_content_and_releases json, with another one (`ALL`) containing all topics specified.

### Changing the atlas content

The master list for the classifications used in the atlas is found in `input_metadata_files/Atlas_content_and_releases.json`.
