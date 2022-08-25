import { type Observable, of, forkJoin } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { switchMap, mergeMap, map, debounceTime, distinctUntilChanged, catchError } from "rxjs/operators";
import type { GeographySearchItem, PostcodeSearchItem } from "../types";
import type { SvelteSubject } from "../util/rxUtil";
import { appBasePath } from "../env";

export type GeoSearchResults = { geographies: GeographySearchItem[]; postcodes: PostcodeSearchItem[] };

export const setupGeoSearch = (query: SvelteSubject<string>): Observable<GeoSearchResults> => {
  return query.pipe(
    debounceTime(400),
    map((q) => q.trimStart()),
    distinctUntilChanged(),
    switchMap((q) => {
      if (q.length > 2) {
        const geographies = fromFetch(`${appBasePath}/geo?q=${q}`).pipe(
          mergeMap((response) => response.json()),
          map(parseGeographySearchItems),
          catchError(handleError),
        );
        const postcodes = fromFetch(`https://api.postcodes.io/postcodes/${q}/autocomplete`).pipe(
          mergeMap((response) => response.json()),
          map(parsePostcodeSearchItems),
          catchError(handleError),
        );
        return forkJoin({
          geographies,
          postcodes,
        });
      } else {
        return of({ geographies: [], postcodes: [] });
      }
    }),
    // tap(console.log), // uncomment and import { tap } from "rxjs" to debug this pipeline
  );
};

const parseGeographySearchItems = (json: any): GeographySearchItem[] => {
  return json.map((geo) => ({ kind: "Geography", ...geo }));
};
const parsePostcodeSearchItems = (json: any): PostcodeSearchItem[] => {
  return (json.result ?? []).map((postcode) => ({ kind: "Postcode", value: postcode }));
};
const handleError = (err: any) => {
  // an error during a typeahead search request isn't fatal
  console.error(err);
  return of([]);
};
