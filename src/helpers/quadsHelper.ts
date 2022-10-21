import quadsDataTileGrid from "../quadsDataTileGrid.json";

function quadsToGeojson(quads) {
  const geojson = { type: "FeatureCollection", features: [] };
  geojson.features = quads.map((q) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [(q.bbox.east + q.bbox.west) / 2, (q.bbox.north + q.bbox.south) / 2],
    },
  }));
  return geojson;
}

/// Centroids for the OA quads in a geojson format
export const centroidsGeojson = {
  type: "geojson",
  data: quadsToGeojson(quadsDataTileGrid.oa),
};
