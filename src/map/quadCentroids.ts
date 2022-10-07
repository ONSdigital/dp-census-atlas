// This script outputs centroids for the OA quads in a geojson format
import quadsDataTileGrid from "../quadsDataTileGrid.json";

function quadsToGeojson(quads) {
  console.log("msoa quad count", quads.length)
  let geojson = {type: "FeatureCollection", features: []};
  geojson.features = quads.map(q => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [(q.bbox.east + q.bbox.west) / 2, (q.bbox.north + q.bbox.south) / 2]
      }
    }));
  return geojson;
}

export default quadsToGeojson(quadsDataTileGrid.oa);