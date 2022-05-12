import { getQuantisedBbox, MaxZoomToUseUKBbox, UKBbox } from "./spatialHelper";
import { vi } from "vitest";

const testBbox = {
  east: 1,
  north: 50,
  west: -1,
  south: 48,
};

const mockTileBeltBBox = [1, 2, 3, 4];

describe("getQuantisedBbox", () => {
  beforeEach(() => {
    // ToDo - figure out how you set these mock return values per test...
    vi.mock("@mapbox/tilebelt", () => ({
      pointToTile: vi.fn(),
      tileToBBOX: vi.fn(() => {
        return mockTileBeltBBox;
      }),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
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
    const expectedBbox = {
      east: mockTileBeltBBox[2],
      north: mockTileBeltBBox[3],
      west: mockTileBeltBBox[0],
      south: mockTileBeltBBox[1],
    };
    expect(getQuantisedBbox(testBbox, zoom)).toEqual(expectedBbox);
  });
});
