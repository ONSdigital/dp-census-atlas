import type { GeoType } from "../types";

export const layers = [
  {
    name: "lad" as GeoType,
    urlTemplate: "https://cdn.jsdelivr.net/gh/VivianAllen/maptiles/authorities-2011/v4/{z}/{x}/{y}.pbf",
    minZoom: 5,
    idProperty: "lad11cd",
    sourceLayer: "lad",
  },
  {
    name: "msoa" as GeoType,
    urlTemplate: "https://cdn.ons.gov.uk/maptiles/administrative/msoa/v2/boundaries/{z}/{x}/{y}.pbf",
    minZoom: 9,
    idProperty: "areacd",
    sourceLayer: "msoa",
  },
  {
    name: "oa" as GeoType,
    urlTemplate: "https://cdn.jsdelivr.net/gh/bothness/map-tiles/oa/{z}/{x}/{y}.pbf",
    minZoom: 10,
    idProperty: "areacd",
    sourceLayer: "boundaries",
  },
];

export const layersWithSiblings = () => {
  return layers
    .slice(1)
    .map((l, i) => ({ layer: layers[i], next: l }))
    .concat({ layer: layers[layers.length - 1], next: undefined });
};
