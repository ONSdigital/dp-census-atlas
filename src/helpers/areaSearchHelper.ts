import { type Observable, of, forkJoin, tap } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { switchMap, mergeMap, map, debounceTime, distinctUntilChanged, catchError } from "rxjs/operators";
import type { AreaSearchItem, GeographySearchItem, PostcodeSearchItem } from "../types";
import type { SvelteSubject } from "../util/rxUtil";
import { appBasePath } from "../buildEnv";
import Pbf from "pbf";
import vt from "@mapbox/vector-tile";
import tb from "@mapbox/tilebelt";
import inPolygon from "@turf/boolean-point-in-polygon";

export const composeAreaSearch = (query: SvelteSubject<string>): Observable<AreaSearchItem[]> =>
  query.pipe(
    debounceTime(400),
    map((q) => q.trimStart()),
    distinctUntilChanged(),
    switchMap((q) => {
      if (q.length < 3) {
        return of([]);
      } else {
        const geographies = fromFetch(`${appBasePath}/api/geo?q=${q}`).pipe(
          mergeMap((response) => response.json()),
          map(parseGeographySearchItems),
          catchError(handleGeographySearchError),
        );
        const postcodes = fromFetch(`https://api.postcodes.io/postcodes/${q}/autocomplete`).pipe(
          mergeMap((response) => response.json()),
          map(parsePostcodeSearchItems),
          catchError(handlePostcodeSearchError),
        );
        return forkJoin({
          geographies,
          postcodes,
        }).pipe(map((r) => [...r.geographies, ...r.postcodes]));
      }
    }),
    // tap(console.log), // uncomment and import { tap } from "rxjs" to debug this pipeline
  );

const parseGeographySearchItems = (json: any): GeographySearchItem[] => {
  return json.map((geo) => ({ kind: "Geography", value: geo.en, ...geo }));
};
const parsePostcodeSearchItems = (json: any): PostcodeSearchItem[] => {
  return (json.result ?? []).map((postcode) => ({ kind: "Postcode", value: postcode }));
};

// todo: DRY if we can figure out the type inference
function handleGeographySearchError(err: any): Observable<GeographySearchItem[]> {
  // an error during a typeahead search request isn't fatal
  console.error(err);
  return of([] as GeographySearchItem[]);
}
function handlePostcodeSearchError(err: any): Observable<PostcodeSearchItem[]> {
  // an error during a typeahead search request isn't fatal
  console.error(err);
  return of([] as PostcodeSearchItem[]);
}

export async function getOAfromLngLat(lng, lat) {
  let tile = tb.pointToTile(lng, lat, 12);
  let url = `https://cdn.ons.gov.uk/maptiles/administrative/2021/oa/v2/boundaries/${tile[2]}/${tile[0]}/${tile[1]}.pbf`;
  try {
    let geojson = await getTileAsGeoJSON(url, tile);
    let pt = {type: "Point", coordinates: [lng, lat]};
    for (const f of geojson.features) {
      if (inPolygon(pt, f.geometry)) return f.properties.areacd;
    }
    return null;
  }
  catch {
    return null;
  }
}

async function getTileAsGeoJSON(url, tile) {
  console.log(`Getting tile ${url}`)
  let res = await fetch(url);
  let buf = await res.arrayBuffer();
  let pbf = new Pbf(buf);
  let geojson = {type: "FeatureCollection", features: []};
  let t = new vt.VectorTile(pbf);
  for (const key in t.layers) {
    for (let i = 0; i < t.layers[key].length; i ++) {
      geojson.features.push(t.layers[key].feature(i).toGeoJSON(...tile));
    }
  }
  return geojson;
}