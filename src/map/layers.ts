export const layers = [
  {
    name: "lad",
    urlTemplate: "https://cdn.jsdelivr.net/gh/VivianAllen/maptiles/authorities-2011/v4/{z}/{x}/{y}.pbf",
    minZoom: 5,
    minZoomForOutlines: 8,
    idProperty: "lad11cd",
  },
  {
    name: "msoa",
    urlTemplate: "https://cdn.ons.gov.uk/maptiles/administrative/msoa/v2/boundaries/{z}/{x}/{y}.pbf",
    minZoom: 9,
    minZoomForOutlines: 13,
    idProperty: "areacd",
  },
];
