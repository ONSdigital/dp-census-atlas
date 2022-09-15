import type { GeoType } from "../types";

export const layers = [
  {
    name: "lad" as GeoType,
    urlTemplate: "https://cdn.ons.gov.uk/maptiles/administrative/2021/authorities-ew/v1/boundaries/{z}/{x}/{y}.pbf",
    minZoom: 5,
    sourceMaxZoom: 12, // The maximum zoom level that the tiles are available for
    idProperty: "areacd",
    sourceLayer: "authority",
  },
  {
    name: "msoa" as GeoType,
    urlTemplate: "https://cdn.ons.gov.uk/maptiles/administrative/2021/msoa/v2/boundaries/{z}/{x}/{y}.pbf",
    minZoom: 6,
    sourceMaxZoom: 12,
    idProperty: "areacd",
    sourceLayer: "msoa",
  },
  {
    name: "oa" as GeoType,
    urlTemplate: "https://cdn.ons.gov.uk/maptiles/administrative/2021/oa/v2/boundaries/{z}/{x}/{y}.pbf",
    minZoom: 8,
    sourceMaxZoom: 12,
    idProperty: "areacd",
    sourceLayer: "oa",
  },
];

export const layersWithSiblings = () => {
  return layers
    .slice(1)
    .map((l, i) => ({ layer: layers[i], next: l }))
    .concat({ layer: layers[layers.length - 1], next: undefined });
};
