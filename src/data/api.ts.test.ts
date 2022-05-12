import { vi } from "vitest";
import * as api from "./api";

describe("memFetchQuery", () => {
  beforeEach(() => {
    // Mocking external calls from fetchQuery here, as seems difficult to mock the memoized function itself in vitest.
    vi.mock("d3-dsv");
    global.fetch = vi.fn().mockImplementation(() => {
      return Promise.resolve({
        text: () => {
          return Promise.resolve({});
        },
      });
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  test("fetches data on each call, given unique arguments", () => {
    api.memFetchQuery({
      totalCode: "totalCode1",
      categoryCode: "categoryCode1",
      geoType: "GeoType1",
      bbox: {
        east: 1,
        north: 2,
        west: 3,
        south: 4,
      },
    });
    api.memFetchQuery({
      totalCode: "totalCode2",
      categoryCode: "categoryCode2",
      geoType: "GeoType2",
      bbox: {
        east: 4,
        north: 5,
        west: 6,
        south: 7,
      },
    });
    api.memFetchQuery({
      totalCode: "totalCode3",
      categoryCode: "categoryCode3",
      geoType: "GeoType3",
      bbox: {
        east: 8,
        north: 9,
        west: 10,
        south: 11,
      },
    });
    expect(global.fetch).toBeCalledTimes(3);
  });
  test("fetches data only once when called repeatedly with the same arguments", () => {
    api.memFetchQuery({
      totalCode: "totalCode4",
      categoryCode: "categoryCode4",
      geoType: "GeoType4",
      bbox: {
        east: 1,
        north: 2,
        west: 3,
        south: 4,
      },
    });
    api.memFetchQuery({
      totalCode: "totalCode4",
      categoryCode: "categoryCode4",
      geoType: "GeoType4",
      bbox: {
        east: 1,
        north: 2,
        west: 3,
        south: 4,
      },
    });
    api.memFetchQuery({
      totalCode: "totalCode4",
      categoryCode: "categoryCode4",
      geoType: "GeoType4",
      bbox: {
        east: 1,
        north: 2,
        west: 3,
        south: 4,
      },
    });
    expect(global.fetch).toBeCalledTimes(1);
  });
});

describe("memFetchBreaks", () => {
  beforeEach(() => {
    // Mocking external calls from fetchQuery here, as seems difficult to mock the memoized function itself in vitest.
    vi.mock("d3-dsv");
    global.fetch = vi.fn().mockImplementation(() => {
      return Promise.resolve({
        json: () => {
          return Promise.resolve({});
        },
      });
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  test("fetches data on each call, given unique arguments", () => {
    api.memFetchBreaks({
      totalCode: "totalCode1",
      categoryCodes: ["categoryCode1", "categoryCode2", "categoryCode3"],
      geoType: "GeoType1",
    });
    api.memFetchBreaks({
      totalCode: "totalCode2",
      categoryCodes: ["categoryCode4", "categoryCode5", "categoryCode6"],
      geoType: "GeoType2",
    });
    api.memFetchBreaks({
      totalCode: "totalCode3",
      categoryCodes: ["categoryCode7", "categoryCode8", "categoryCode9"],
      geoType: "GeoType3",
    });
    expect(global.fetch).toBeCalledTimes(3);
  });
  test("fetches data only once when called repeatedly with the same arguments", () => {
    api.memFetchBreaks({
      totalCode: "totalCode4",
      categoryCodes: ["categoryCode10", "categoryCode11", "categoryCode12"],
      geoType: "GeoType4",
    });
    api.memFetchBreaks({
      totalCode: "totalCode4",
      categoryCodes: ["categoryCode10", "categoryCode11", "categoryCode12"],
      geoType: "GeoType4",
    });
    api.memFetchBreaks({
      totalCode: "totalCode4",
      categoryCodes: ["categoryCode10", "categoryCode11", "categoryCode12"],
      geoType: "GeoType4",
    });
    expect(global.fetch).toBeCalledTimes(1);
  });
});
