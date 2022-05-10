import { getQuantisedBbox, MaxZoomToUseUKBbox, UKBbox } from "./spatialHelper";
import tilebelt from "@mapbox/tilebelt";

const testBbox = {
  east: 1,
  north: 50,
  west: -1,
  south: 48,
};

describe("getQuantisedBbox", () => {
  test("returns UK bbox for zoom levels below MaxZoomToUseUKBbox", () => {
    const zoom = MaxZoomToUseUKBbox * 0.8;
    expect(getQuantisedBbox(testBbox, zoom)).toEqual(UKBbox);
  });
  test("returns UK bbox for zoom levels at MaxZoomToUseUKBbox", () => {
    const zoom = MaxZoomToUseUKBbox;
    expect(getQuantisedBbox(testBbox, zoom)).toEqual(UKBbox);
  });
  test("returns bbox based on slippy map tile X,Y grid for zoom levels above MaxZoomToUseUKBbox", () => {
    const zoom = MaxZoomToUseUKBbox * 2;
    const mockTileBeltBBox = [1, 2, 3, 4];
    jest.spyOn(tilebelt, "tileToBBOX").mockReturnValue(mockTileBeltBBox);
    const expectedBbox = {
      east: mockTileBeltBBox[2],
      north: mockTileBeltBBox[3],
      west: mockTileBeltBBox[0],
      south: mockTileBeltBBox[1],
    };
    expect(getQuantisedBbox(testBbox, zoom)).toEqual(expectedBbox);
  });
});
