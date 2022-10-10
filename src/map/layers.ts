import type { GeoType } from "../types";

export const layers = [
  {
    name: "lad" as GeoType,
    urlTemplate: "https://cdn.jsdelivr.net/gh/VivianAllen/maptiles/authorities-2011/v4/{z}/{x}/{y}.pbf",
    minZoom: 5,
    sourceMaxZoom: 12, // The maximum zoom level that the tiles are available for
    idProperty: "lad11cd",
    sourceLayer: "lad",
  },
  {
    name: "msoa" as GeoType,
    urlTemplate: "https://cdn.jsdelivr.net/gh/bothness/map-tiles/msoa/{z}/{x}/{y}.pbf",
    minZoom: 6,
    sourceMaxZoom: 12,
    idProperty: "areacd",
    sourceLayer: "boundaries",
  },
  {
    name: "oa" as GeoType,
    urlTemplate: "https://cdn.jsdelivr.net/gh/bothness/map-tiles/oa/{z}/{x}/{y}.pbf",
    minZoom: 8,
    sourceMaxZoom: 12,
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
