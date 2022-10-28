import type * as dsv from "d3-dsv"; // https://github.com/d3/d3/issues/3469
import { asyncDerived } from "@square/svelte-store";
import { fetchBreaks, fetchTileDataForBbox } from "../data/api";
import { selection } from "./selection";
import { viewport } from "./viewport";

/**
 * A Svelte store containing all the data we need in order to show a vizualisation.
 * */
export const viz = asyncDerived([selection, viewport], async ([$selection, $viewport]) => {
  const args = {
    category: $selection.category,
    geoType: $viewport.geoType,
    bbox: $viewport.bbox,
  };

  // important for feature state purging
  if (!args.category) {
    return undefined;
  }
  // current geotype is unavailable for current selection
  if (!$selection.classification.available_geotypes.includes($viewport.geoType)) {
    return undefined;
  }

  const [data, breaks] = await Promise.all([fetchTileDataForBbox(args), fetchBreaks(args)]);

  return {
    geoType: args.geoType,
    breaks: breaks.breaks[args.category.code],
    minMaxVals: breaks.minMax[args.category.code],
    places: data.map((row) => parsePlaceData(row, args.category.code)),
    params: {
      ...$selection,
    },
  };
});

const parsePlaceData = (row: dsv.DSVRowString<string>, categoryCode: string) => {
  const geoCode = row.geography_code;
  const ratioToTotal = parseFloat(row[categoryCode]);
  return { geoCode, ratioToTotal };
};
