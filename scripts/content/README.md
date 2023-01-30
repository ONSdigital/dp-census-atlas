# Census maps content file generation

## Overview

Utility scripts for making and editing content.json files for consumption by the atlas. These files hold the census metadata the atlas needs to fetch and display census data.

# 1a. RUN SCRIPT USING CONDA

## Requirements

- Anaconda[https://www.anaconda.com/]

## Getting started

## How to use

### installing dependencies

- Start up a new anaconda shell
- Install dependencies into new virtual env with `conda env create --file environment.yml`
- Activate conda env with `conda activate census-maps-content-generation-env`

### Make new content json

1. Ensure requirements and dependencies are installed
2. Download latest cantabular metadata archive from [https://confluence.ons.gov.uk/pages/viewpage.action?spaceKey=ODADH&title=Upload+Metadata+Files+to+support+NOMIS%2C+Testing+etc](https://confluence.ons.gov.uk/pages/viewpage.action?spaceKey=ODADH&title=Upload+Metadata+Files+to+support+NOMIS%2C+Testing+etc)
3. Unzip cantabular metadata into a new directory within `input_metadata_files`
4. Update the the `cantabular_metadata_dir` value in `2021-content-spec.json` to the name of the new unzipped metadata archive made in step 2 (NB just the name o the unzipped directory, not its full path - the scripts add the full path in at runtime).
5. Run the scripts with `python make_content_jsons.py 2021-content-spec.json`
6. New versions of the content jsons will appead in the `output_content_jsons` directory.

### running unit tests

1. Ensure requirements and dependencies are installed
2. Invoke tests with `python -m pytest` (or in verbose mode with `python -m pytest -v`)

# 1b. RUN SCRIPT USING PIPENV

## Requirements

- Pyenv - version manager for Python ([installation instructions](https://github.com/pyenv/pyenv#installation)). This is needed to ensure the right version of python is used.
- Pipenv - npm-like Python dependencies-manager / script runner ([installation instructions](https://pipenv.pypa.io/en/latest/#install-pipenv-today) - NB recomend global `pip install pipenv` over the user-specific install in the instructions).
- Python 3.11.0 (although Pyenv + Pipenv should ensure this version is installed).

## Getting started

## How to use

### installing dependencies

- Ensure requirements are installed
- Install dependencies into new virtual env with `pipenv install`

### Make new content json

1. Ensure requirements and dependencies are installed
2. Download latest cantabular metadata archive from [https://confluence.ons.gov.uk/pages/viewpage.action?spaceKey=ODADH&title=Upload+Metadata+Files+to+support+NOMIS%2C+Testing+etc](https://confluence.ons.gov.uk/pages/viewpage.action?spaceKey=ODADH&title=Upload+Metadata+Files+to+support+NOMIS%2C+Testing+etc)
3. Unzip cantabular metadata into a new directory within `input_metadata_files`
4. Update the the `cantabular_metadata_dir` value in `2021-content-spec.json` to the name of the new unzipped metadata archive made in step 2 (NB just the name o the unzipped directory, not its full path - the scripts add the full path in at runtime).
5. Run the scripts with `pipenv run make-content-jsons`
6. New versions of the content jsons will appead in the `output_content_jsons` directory.

### running unit tests

1. Ensure requirements and dependencies are installed
2. Invoke tests with `pipenv run tests` (or in verbose mode with `pipenv run testsv`)

# 2. PUBLISH RESULTS

## Uploading new map content

The content jsons need to be in two places to be loaded by various instances of census maps:

1. **local/dev**: The local instance of census maps loads content json directly from the scripts `output_content_jsons` directory. so no additional action beyond checking in the new versions is needed for local.
2. **publishing-preview/prod**: The publishing preview and production instances of census maps load their content json from florence visualisations. There are different visualisations for different content jsons. The shell script `make-florence-zips.sh` will produce a zip file named for each florence visualisation (plus a timestamp) containing the content json for each when executed with `./make-florence-zips.sh`. See the script itself for more details.

## Changing census maps content

### Changing variable groups, variables, classifications or dropping categories from classifications

The master list of census maps content is found in the `2021-content-spec.json` file, in `content_json`. This is a
heirarchy of census content:

```
content_jsons
    \-> variable_groups
        \-> variables
            \-> classifications
                \-> categories
```

The variable_groups are things made specifically for census maps - their name, slug and description is set in the `2021-content-spec.json` file. Each variable group definition contains definitions for one or more content_jsons, in `variables`.

For normal variables, the only config needed is an object with the variable code and an array of classifications defining which classifications to include for each variable:

```json
{
  "code": "uk_armed_forces",
  "classifications": ["uk_armed_forces"]
}
```

Additionally, if some categories need to be removed from specific classifications, a `classification_dropped_categories` key can be added that lists which categories (by name) are to be dropped from which classifications, e.g.:

```json
{
  "code": "transport_to_workplace",
  "classifications": ["transport_to_workplace_12a"],
  "classification_dropped_categories": {
    "transport_to_workplace_12a": ["Not in employment or aged 15 years and under"]
  }
}
```

If a custom variable (i.e. one that is not present in the ONS / Cantabular metadata) is needed, included the **full definition** for it under a `custom_variable` key in the variable object, e.g:

```json
{
  "custom_variable": {
    "name": "Median age",
    "code": "median_age",
    "slug": "median-age",
    "desc": "The median age of people on Census Day, 21 March 2021.",
    "long_desc": "Median age is calculated from the age of residents on Census Day, 21 March 2021 in England and Wales. The median age is the age of the person in the middle of the group, such that one half of the group is younger than that person and the other half is older.",
    "units": "Years",
    "topic_code": "DEM",
    "classifications": [
      {
        "code": "median_age",
        "slug": "median-age",
        "desc": "Median age",
        "available_geotypes": ["msoa", "lad"],
        "choropleth_default": true,
        "data_download": "https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates/articles/demographyandmigrationdatacontent/2022-11-02",
        "categories": [
          {
            "name": "Median age",
            "slug": "median-age",
            "code": "median_age-001",
            "legend_str_1": "Median age of people in {location}",
            "legend_str_2": "in",
            "legend_str_3": "years"
          }
        ]
      }
    ]
  }
}
```

Variable groups, variables (including custom variables) and classifications will appear in the output content jsons in the order they are specified in the `2021-content-spec.json` file. Categories will appear in the order of their internal code / census question number.

### Changing custom census maps metadata (legend strings, short variable descriptions, etc)

Census maps content uses several types of custom metadata not found in the ONS / Cantabular metadata. These are found in csv files in `input_metadata_files_dir`. Values can be changed / new metadata added simply by editing the values in these files (NB - any custom variables
defined in the `2021-content-spec.json` are assumed to be fully defined and are not referenced int he additiol a)

1. `category_legend_strings.csv`: Legend strings used for each category.
2. `classification_2011_comparison_data_availability.csv`: Whether or not 2011 comparison data is available for each classification, and for which geographies.
3. `classification_available_geotypes.csv`: which geography types are available for each classification.
4. `classification_data_downloads.csv`: where data for each classification can be downloaded (NB not all classifications will have data downloads and thats fine).
5. `variable_caveats.csv`: Warnings about data quality for variables (NB not all variables will have warnings and that's fine).
6. `variable_map_type_default_classifications.csv`: Which classifications are the default ones for different map visualisation types.
7. `variable_short_descriptions.csv`: Short descriptions for each variable.
8. `variable_tile_data_base_urls.csv`: S3 urls where the data for each variable can be found.
