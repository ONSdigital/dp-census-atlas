# Census maps content file generation

## Overview

Utility scripts for making and editing content.json files for consumption by the census maps. These files hold the census metadata the atlas needs to fetch and display census data.

## Requirements

This script can be run using either [Anaconda](https://www.anaconda.com/) or [pipenv](https://pipenv.pypa.io/en/latest/) for dependency management.

### Conda

- [Anaconda](https://www.anaconda.com/)

### Pipenv

- Pyenv - version manager for Python ([installation instructions](https://github.com/pyenv/pyenv#installation)). This is needed to ensure the right version of python is used.
- Pipenv - npm-like Python dependencies-manager / script runner ([installation instructions](https://pipenv.pypa.io/en/latest/#install-pipenv-today) - NB recomend global `pip install pipenv` over the user-specific install in the instructions).
- Python 3.11.0 (although Pyenv + Pipenv should ensure this version is installed).

## How to use

### Installing dependencies

#### Conda

- Ensure requirements are installed.
- Start up a new anaconda shell.
- Install dependencies into new virtual env defined by the checked-in `environment.yml` file with `conda env create --file environment.yml`.
- Activate conda env with `conda activate census-maps-content-generation-env`.

#### Pipenv

- Ensure requirements are installed.
- Install dependencies into new virtual env defined by the checked-in `Pipfile` with `pipenv install`.

### Make or update content json

1. Ensure requirements and dependencies are installed
2. Download latest cantabular metadata archive from [https://confluence.ons.gov.uk/pages/viewpage.action?spaceKey=ODADH&title=Upload+Metadata+Files+to+support+NOMIS%2C+Testing+etc](https://confluence.ons.gov.uk/pages/viewpage.action?spaceKey=ODADH&title=Upload+Metadata+Files+to+support+NOMIS%2C+Testing+etc)
3. Unzip cantabular metadata into a new directory within `input_metadata_files`
4. Update the the `cantabular_metadata_dir` value in `2021-content-spec.json` to the name of the new unzipped metadata archive made in step 2 (NB just the name o the unzipped directory, not its full path - the scripts add the full path in at runtime).
5. Run the scripts:
   - **Conda**: `python make_content_jsons.py 2021-content-spec.json`
   - **Pipenv**: `pipenv run make-content-jsons`
6. New versions of the content jsons will appear in the `src/data/staticContentJsons` directory (relative to project root).

### running unit tests

1. Ensure requirements and dependencies are installed
2. Invoke tests:
   - **Conda**: `python -m pytest` (or in verbose mode with `python -m pytest -v`)
   - **Pipenv**: `pipenv run tests` (or in verbose mode with `pipenv run testsv`)

### Publishing content json

The content jsons need to be in two places to be loaded by various instances of census maps:

1. **local/dev**: The local instance of census maps loads content json directly from the `src/data/staticContentJsons` directory that the script outputs. When updating an existing content json, no additional action beyond checking in the new versions is needed for local. If you have added a new content json, see [Adding new content json](#adding-new-content-json), below.
2. **publishing-preview/prod**: The publishing preview and production instances of census maps load their content json from florence visualisations. There are different visualisations for different content jsons. The shell script `make-florence-zips.sh` will produce a zip file named for each florence visualisation (plus a timestamp) containing the content json for each when executed with `./make-florence-zips.sh`. See the script itself for more details. If the zip script cannot be run (if on a windows machine, for example), the content json must be manually added to the root level of a zip file. The zipfile must then be uploaded to florence as either a new visualisation or an update to an existing one.

## Updating census maps content

### Adding fake data for local dev or netlify

The file `input_metadata_files/variable_tile_data_base_urls.csv` (see [Changing custom census maps metadata](#changing-custom-census-maps-metadata-legend-strings-short-variable-descriptions-etc), below) holds the urls from which census data will be fetched. There are two url types for each variable, `2021_data_base_url`, which is for standard census 2021 data and should _always_ have a value, and `2011_2021_comparison_data_base_url`, which is for the 2011-2021 comparison, and will only have a value if that data is avaialble for that variable.

In addition, there area two more columns, `2021_data_fake_dev_override` and `2011_2021_comparison_data_base_url` - these urls, if values are supplied, will overwrite the normal urls when running census maps either locally (with `npm run dev`) or on Netlify. Adding values for these urls allows you to load fake (i.e. unsensitive) data for development work and public feature demos.

### Updating variable groups, variables, classifications or dropping categories from classifications

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
2. `classification_2011_2021_comparison_data_available_geotypes.csv`: Whether or not census 2011 comparison data is available for each classification, and for which geographies.
3. `classification_2021_data_available_geotypes.csv`: which geography types are available for each census 2021 data classification.
4. `classification_data_downloads.csv`: where data for each classification can be downloaded (NB not all classifications will have data downloads and thats fine).
5. `variable_caveats.csv`: Warnings about data quality for variables (NB not all variables will have warnings and that's fine).
6. `variable_map_type_default_classifications.csv`: Which classifications are the default ones for different map visualisation types.
7. `variable_short_descriptions.csv`: Short descriptions for each variable.
8. `variable_tile_data_base_urls.csv`: S3 urls where the data for each variable can be found (both 2021 data and 2011 comparison data, when available), including any fake data overrides used in local dev or netlify. (see [Adding fake data](#adding-fake-data-for-local-dev-or-netlify), above)

## Adding new content json

To add an entirely new content json file, add a new object to the `content_json` array in the `2021-content-spec.json` file. This new object should have (minimally) a `content` array containing variable group definitions, as explained in the [Updating variable groups](#updating-variable-groups-variables-classifications-or-dropping-categories-from-classifications) section, above.

The new content json will be written to `src/data/staticContentJsons` along with the standard `2021-MASTER.json`. This will need to be published
To have this content json read by the census maps, there are two options, one which requires a change to the census maps code, and one which does not.

### Code change: Loading new content json by hardcoding a reference into src/data/content.ts

To add a hardcoded reference to the new content json:

1. Update `src/data/staticContentJsons/index.ts` with an additional import statement for the new json, and an additional value in the exported index object.
2. Update the exported array in `content.ts` with a new object detailing your new content json. It must have these properties:

   - `devContentJsonUrl`: Where the content json can be loaded from for local dev or netlify.
   - `webContentJsonUrl`: Where the content json can be loaded from for prod (this will generally be a florence url).
   - `publishingContentJsonUrl`: Where the content json can be loaded from for publishing preview (this will always be a florence url).

   e.g.

   ```js
   {
     devContentJsonUrl: "2021-MASTER.json",
     webContentJsonUrl: "https://www.ons.gov.uk/visualisations/censusmapsmasterconfig/2021-MASTER.json",
     publishingContentJsonUrl:
       "https://publishing.dp-prod.aws.onsdigital.uk/visualisations/censusmapsmasterconfig/2021-MASTER.json",
   }
   ```

The value for any of the urls _can_ be simply the name of the file (e.g. `2021-MASTER.json` in the example above). This will result in the content json being loaded from directly from `src/data/staticContentJsons` rather than being fetched remotely (NB step 1 above _must_ be done for this to work).

The value for any of the urls _can_ also be blank (`""`). This will result in the content json being ignored in the relevant env:

- `devContentJsonUrl`=`""` (Content json will not be loaded in local dev / netlify).
- `webContentJsonUrl`=`""` (Content json will not be loaded in prod).
- `publishingContentJsonUrl`=`""` (Content json will not be loaded in publishing preview).

NB - as the name suggests, the value for `devContenJsonUrl` can also be a full url (e.g. an s3 url) if you want local dev or netlify to fetch your new content json from a remote source. The content-loading routine will assume anything that doesn't start with `http` means that the content json is to be loaded from the `src/data/staticContentJsons` folder.

### No code change: Loading new content json as parasitic load defined in 2021-MASTER.json

If you want to have your new content json loaded without making any code changes, you can add an object to the `additional_content_jsons` array found in the definition for the `2021-MASTER` content json in `2021-content-spec.json`. This object must have the same properties as if [hardcoded into src/data/content.ts](#code-change-loading-new-content-json-by-hardcoding-a-reference-into-srcdatacontentts) (see above).

When `2021-MASTER.json` is loaded, any additional content json referened in its `additional_content_jsons` array will be loaded as a side-effect.

_NB: Without making code changes, you cannot use static loading for your new content json (as this requires both updates to content.ts etc, AND that the new content json itself is checked-in). You must therefore use full URLs for all values._
