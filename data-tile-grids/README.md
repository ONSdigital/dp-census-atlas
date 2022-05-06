# tilesToBBoxes.js

Script for converting JSON file with arrays of tiles as used in mapping data grids by data vis (e.g. here: https://github.com/bothness/oa-map/blob/main/public/data/quads.json) into JSON file with arrays of bounding boxes, defined as the Bbox type (see `src/types.ts`). This allows the grids to be used to quantise bounding box requests made by the API (rather than requests being made for the current map viewport, which will be extremly variable, they can snap to one or more of these predefined grids).

## Usage

- download map tile grid JSON file (e.g [quads.json](https://github.com/bothness/oa-map/blob/main/public/data/quads.json), as mentioned above) to `dp-census-atlas/data-tile-grids`
- (assuming you have installed the project dependencies with `npm install` from project root folder `dp-census-atlas`), `cd data-tile-grids` and `node tilesToDataTileGrid.js <your tile JSON filename here>`, e.g. `node tilesToDataTileGrid.js quads.json`
- JSON file with grid bboxes (as long,lat coordinates) will be written to `dp-census-atlas/data-tile-grids/<your tile JSON filename minus .json extension>DataTileGrid.json`, e.g. `dp-census-atlas/data-tile-grids/quadsDataTileGrid.json`