import type { Coord } from "@turf/helpers";
import { appBasePath } from "../buildEnv";
import type { GeographySearchItem, PostcodeSearchItem } from "../types";
import Pbf from "pbf";
import vt from "@mapbox/vector-tile";
import tb from "@mapbox/tilebelt";
import inPolygon from "@turf/boolean-point-in-polygon";

export const composeAreaSearch = async (q: string) => {
  const fetched = await Promise.all([fetchParseGeographyResults(q), fetchParsePostcodeResults(q)]);
  return fetched.flat();
};

export const fetchParseGeographyResults = async (q: string) => {
  try {
    const response = await fetch(`${appBasePath}/api/geo?q=${q}`);
    const json = await response.json();
    return parseGeographySearchItems(json);
  } catch (err) {
    return handleGeographySearchError(err);
  }
};

export const fetchParsePostcodeResults = async (q: string) => {
  try {
    const response = await fetch(`https://api.postcodes.io/postcodes/${q}/autocomplete`);
    const json = await response.json();
    return parsePostcodeSearchItems(json);
  } catch (err) {
    return handlePostcodeSearchError(err);
  }
};

const parseGeographySearchItems = (json: any): GeographySearchItem[] => {
  return json.map((geo) => ({ kind: "Geography", value: geo.en, ...geo }));
};
const parsePostcodeSearchItems = (json: any): PostcodeSearchItem[] => {
  return (json.result ?? []).map((postcode) => ({ kind: "Postcode", value: postcode }));
};

// todo: DRY if we can figure out the type inference
function handleGeographySearchError(err: any): GeographySearchItem[] {
  // an error during a typeahead search request isn't fatal
  console.error(err);
  return [] as GeographySearchItem[];
}
function handlePostcodeSearchError(err: any): PostcodeSearchItem[] {
  // an error during a typeahead search request isn't fatal
  console.error(err);
  return [] as PostcodeSearchItem[];
}

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
