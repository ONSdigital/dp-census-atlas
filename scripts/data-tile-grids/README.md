# tilesToDataTileGrid.js

Script for converting JSON file with arrays of tiles as used in mapping data grids by Data Vis into JSON file with arrays of bounding boxes, defined as the Bbox type (see `../src/types.ts`).

## Usage

- download map tile grid JSON file (e.g [quads.json](https://github.com/bothness/oa-map/blob/main/public/data/quads.json), as mentioned above) to this directory, which should be committed here as `quads.json`.
- ensure you have installed the project dependencies with `npm install` in the project root folder

      node tilesToDataTileGrid.js quads.json

- JSON file with grid bboxes (as long,lat coordinates) will be written to `dp-census-atlas/src/<your tile JSON filename minus .json extension>DataTileGrid.json`, e.g. `dp-census-atlas/src/quadsDataTileGrid.json`
