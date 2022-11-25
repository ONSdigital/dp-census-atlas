# mkPostcodeLookup.js

Script for filtering postcode lookup csv from [https://geoportal.statistics.gov.uk/datasets/postcode-to-postcode-sector-to-postcode-district-to-postcode-area-to-2021-output-area-august-2022-lookup-in-england-and-wales/about](https://geoportal.statistics.gov.uk/datasets/postcode-to-postcode-sector-to-postcode-district-to-postcode-area-to-2021-output-area-august-2022-lookup-in-england-and-wales/about) and converting to JSON.

## Usage

- download Postcode to Postcode Sector to Postcode District to Postcode Area (e.g [the one from 2021 mentioned above](https://geoportal.statistics.gov.uk/datasets/postcode-to-postcode-sector-to-postcode-district-to-postcode-area-to-2021-output-area-august-2022-lookup-in-england-and-wales/about)) to this directory.
- ensure you have installed the project dependencies with `npm install` in the project root folder

      node mkPostcodeLookup.js pcd_pcds_pcdd_pcda_oa21_aug_22__ew_lu.csv

- JSON files with lookup for postcodes to output area will be written to `output`
- These should then either be placed in s3 or onto the ONS cdn.
