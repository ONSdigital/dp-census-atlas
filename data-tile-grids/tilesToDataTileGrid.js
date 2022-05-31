import { tileToBBOX } from "@mapbox/tilebelt";
import { readFileSync, writeFileSync } from "fs";

if (process.argv.length < 3) {
  throw "Please supply a JSON file of tiles to convert.";
}

const tileJSONfn = process.argv[2];
const quadTiles = JSON.parse(readFileSync(tileJSONfn));
const quadBBoxes = {};

// add default ew tile for LAD if they're not in the input file
if (!("lad" in quadTiles)) {
  quadBBoxes["lad"] = [
    {
      tilename: "ew",
      bbox: { east: 1.76, north: 58.64, west: -7.57, south: 49.92 },
    },
  ];
}

for (const key in quadTiles) {
  quadBBoxes[key] = quadTiles[key].map((tile) => {
    const tilename = tile.map((x) => x.toString()).join("-");
    const bboxRaw = tileToBBOX(tile);
    return {
      tilename: tilename,
      bbox: { east: bboxRaw[2], north: bboxRaw[3], west: bboxRaw[0], south: bboxRaw[1] },
    };
  });
}

const tileJSONfnNoEx = tileJSONfn.split(".")[0];
writeFileSync(`${tileJSONfnNoEx}DataTileGrid.json`, JSON.stringify(quadBBoxes));
