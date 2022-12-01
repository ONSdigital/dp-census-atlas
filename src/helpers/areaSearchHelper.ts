import type { Coord } from "@turf/helpers";
import { appBasePath } from "../buildEnv";
import type { GeographySearchItem, PostcodeSearchItem } from "../types";
import Pbf from "pbf";
import vt from "@mapbox/vector-tile";
import tb from "@mapbox/tilebelt";
import inPolygon from "@turf/boolean-point-in-polygon";

export const isSearchableQuery = (query: string): boolean => {
  return query.length >= 3;
};

export const fetchGeoPostcodeSearchItems = async (q: string): Promise<(GeographySearchItem | PostcodeSearchItem)[]> => {
  if (isSearchableQuery(q)) {
    const fetched = await Promise.all([fetchGeographySearchItems(q), fetchPostcodeSearchItems(q)]);
    return fetched.flat();
  }
  return Promise.resolve([] as GeographySearchItem[]);
};

const fetchGeographySearchItems = async (q: string): Promise<GeographySearchItem[]> => {
  try {
    const response = await fetch(`${appBasePath}/api/geo?q=${q}`);
    const json = await response.json();
    return json.map((geo) => ({ kind: "Geography", value: geo.en, ...geo }));
  } catch (err) {
    console.error(err);
    return Promise.resolve([] as GeographySearchItem[]);
  }
};

const fetchPostcodeSearchItems = async (q: string): Promise<PostcodeSearchItem[]> => {
  try {
    const response = await fetch(`https://api.postcodes.io/postcodes/${q}/autocomplete`);
    const json = await response.json();
    return (json.result ?? []).map((postcode) => ({ kind: "Postcode", value: postcode }));
  } catch (err) {
    console.error(err);
    return Promise.resolve([] as PostcodeSearchItem[]);
  }
};

export async function getOAfromLngLat(lng, lat) {
  const tile = tb.pointToTile(lng, lat, 12);
  const url = `https://cdn.ons.gov.uk/maptiles/administrative/2021/oa/v2/boundaries/${tile[2]}/${tile[0]}/${tile[1]}.pbf`;
  try {
    const geojson = await getTileAsGeoJSON(url, tile);
    const pt = { type: "Point", coordinates: [lng, lat] };
    for (const f of geojson.features) {
      if (inPolygon(pt as Coord, f.geometry)) return f.properties.areacd;
    }
    return null;
  } catch {
    return null;
  }
}

async function getTileAsGeoJSON(url, tile) {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  const pbf = new Pbf(buf);
  const geojson = { type: "FeatureCollection", features: [] };
  const t = new vt.VectorTile(pbf);
  for (const key in t.layers) {
    for (let i = 0; i < t.layers[key].length; i++) {
      geojson.features.push(t.layers[key].feature(i).toGeoJSON(...tile));
    }
  }
  return geojson;
}
