import { GeoTypes } from "../types";
import { englandAndWales } from "./spatialHelper";
import { getSelectedGeography } from "./selectionHelper";

describe("getSelectedGeography", () => {
  test("returns ew when no geography in url", () => {
    const testURL = new URL("https://dp.aws.onsdigital.uk/census-atlas");
    expect(getSelectedGeography(testURL.searchParams)).toEqual({
      geoType: englandAndWales.meta.geotype,
      geoCode: englandAndWales.meta.code,
    });
  });
  // test all known geotypes are found
  for (const g of GeoTypes) {
    const testSelectedGeography = {
      geoType: g,
      geoCode: `testGeoCode${g}`,
    };
    test("retrives selected geography from short url", () => {
      const testURL = new URL(
        `https://dp.aws.onsdigital.uk/census-atlas?${testSelectedGeography.geoType}=${testSelectedGeography.geoCode}`,
      );
      expect(getSelectedGeography(testURL.searchParams)).toEqual(testSelectedGeography);
    });
    test("retrives selected geography from longer url", () => {
      const testURL = new URL(
        `https://dp.aws.onsdigital.uk/census-atlas/choropleth/population?${testSelectedGeography.geoType}=${testSelectedGeography.geoCode}`,
      );
      expect(getSelectedGeography(testURL.searchParams)).toEqual(testSelectedGeography);
    });
    test("retrives selected geography from longest url", () => {
      const testURL = new URL(
        `https://dp.aws.onsdigital.uk/census-atlas/choropleth/population/marital-status/default/single-never-married-or-in-a-civil-partnership?${testSelectedGeography.geoType}=${testSelectedGeography.geoCode}`,
      );
      expect(getSelectedGeography(testURL.searchParams)).toEqual(testSelectedGeography);
    });
  }
});
