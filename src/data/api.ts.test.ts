import { vi } from "vitest";
import * as api from "./api";

describe("memFetchTileData", () => {
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
    api.memFetchTileData({
      categoryCode: "categoryCode1",
      geoType: "GeoType1",
      tile: {
        tilename: "1",
        bbox: {
          east: 1,
          north: 2,
          west: 3,
          south: 4,
        },
      },
    });
    api.memFetchTileData({
      categoryCode: "categoryCode2",
      geoType: "GeoType2",
      tile: {
        tilename: "2",
        bbox: {
          east: 4,
          north: 5,
          west: 6,
          south: 7,
        },
      },
    });
    api.memFetchTileData({
      categoryCode: "categoryCode3",
      geoType: "GeoType3",
      tile: {
        tilename: "3",
        bbox: {
          east: 8,
          north: 9,
          west: 10,
          south: 11,
        },
      },
      
    });
    expect(global.fetch).toBeCalledTimes(3);
  });
  test("fetches data only once when called repeatedly with the same arguments", () => {
    api.memFetchTileData({
      categoryCode: "categoryCode4",
      geoType: "GeoType4",
      tile: {
        tilename: "4",
        bbox: {
          east: 1,
          north: 2,
          west: 3,
          south: 4,
        },
      },
    });
    api.memFetchTileData({
      categoryCode: "categoryCode4",
      geoType: "GeoType4",
      tile: {
        tilename: "4",
        bbox: {
          east: 1,
          north: 2,
          west: 3,
          south: 4,
        },
      },
    });
    api.memFetchTileData({
      categoryCode: "categoryCode4",
      geoType: "GeoType4",
      tile: {
        tilename: "4",
        bbox: {
          east: 1,
          north: 2,
          west: 3,
          south: 4,
        },
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
      categoryCode: "categoryCode1",
      geoType: "GeoType1",
    });
    api.memFetchBreaks({
      categoryCode: "categoryCode4",
      geoType: "GeoType2",
    });
    api.memFetchBreaks({
      categoryCode: "categoryCode7",
      geoType: "GeoType3",
    });
    expect(global.fetch).toBeCalledTimes(3);
  });
  test("fetches data only once when called repeatedly with the same arguments", () => {
    api.memFetchBreaks({
      categoryCode: "categoryCode10",
      geoType: "GeoType4",
    });
    api.memFetchBreaks({
      categoryCode: "categoryCode10",
      geoType: "GeoType4",
    });
    api.memFetchBreaks({
      categoryCode: "categoryCode10",
      geoType: "GeoType4",
    });
    expect(global.fetch).toBeCalledTimes(1);
  });
});
