
# Generating the content JSON file from the content spreadsheet

## Intro

Census Atlas 'content' (metadata for the UI - plain english data labels, descriptions, templated content strings etc) is defined in a shared google worksheet(s), e.g. here: https://docs.google.com/spreadsheets/d/1AD0LGGfPEO2vDRBYWxoEEAf5fjILV9TaUrctHexyhT0/edit#gid=1924886616

This script creates a JSON file that is bundled with the app.

## Dependencies

Requires Python 3.9+ to be available as the default `Python` executable in the current environment. Can be installed and set as the local python as follows (macOS):

- brew install pyenv
- pyenv install 3.10.0
- cd content-csv-to-json && pyenv local 3.10.0

## Instructions

To create a json file making this content available to the atlas:

1. Download the relevant tab from the worksheet into a csv file (file -> download -> Comma Seperated Values (.csv))
2. Run content_csv_to_json.py with `./content_csv_to_json.py {path to your file here}` (NB - uses standard library Python, so doesn't need any dependencies install other than Python 3.9+)
3. This will create a JSON file in the content-csvs folder, named `{your filename}.content.json` (with the `csv` extension removed). The `meta.source` value will reference the csv file used to create the JSON.
4. Validate that all census data codes in the content JSON are available on the API with `./validate_content_json.py {your filename}.content.json`. This will call the API with each code and check the data is available.
5. Copy the contents of `{your filename}.content.json` into the atlas config file - at time of writing, `src/data/apiMetadata.js`

## Tests

To run test for the python scripts in this directory, run `python -m unittest` (assuming you have python 3.9+ available - see 'Dependencies')

## ToDos

Translate this into go!
