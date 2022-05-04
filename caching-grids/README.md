# tilesToBBoxes.js

Script for converting JSON file with arrays of tiles as used in mapping data grids by data vis (e.g. here: https://github.com/bothness/oa-map/blob/main/public/data/quads.json) into JSON file with arrays of bounding boxes. This allows the grids to be used to quantise bounding box requests made by the API (rather than requests being made for the current map viewport, which will be extremly variable, they can snap to one or more of these predefined grids).

## Usage

- download map tile grid JSON file (e.g [quads.json](https://github.com/bothness/oa-map/blob/main/public/data/quads.json), as mentioned above) to `dp-census-atlas/caching-grids`
- (assuming you have installed the project dependencies with `npm install` from project root folder `dp-census-atlas`), `cd caching-grids` and `node tilesToBBoxes.js <your tile JSON filename here>`, e.g. `node tilesToBBoxes.js quads.json`
- JSON file with grid bboxes (as long,lat coordinates) will be written to `dp-census-atlas/caching-grids/<your tile JSON filename minus .json extension>BBoxes.json`, e.g. `dp-census-atlas/caching-grids/quadsBBoxes.json`