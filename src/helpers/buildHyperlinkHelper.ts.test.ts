import { buildHyperlink } from "./buildHyperlinkHelper";
import type { SelectedGeographyData } from "../types";

const mockSelectedGeography = {
  geoType: "lad",
  displayName: "Lad name",
  geoCode: "ladCode",
  variableData: {
    catCode: { count: 0, percentage: 0, total: 0 },
  },
} as SelectedGeographyData;

test("returns correct url given all inputs", () => {
  const args = {
    topic: "topic",
    variable: "variable",
    classification: "classification",
    category: "category",
    selectedGeography: mockSelectedGeography,
  };
  const url = buildHyperlink(args);
  expect(url).toEqual("/2021/topic/variable/classification/category?lad=ladCode");
});
