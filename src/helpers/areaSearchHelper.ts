import { type Observable, of, forkJoin, tap } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { switchMap, mergeMap, map, debounceTime, distinctUntilChanged, catchError } from "rxjs/operators";
import type { AreaSearchItem, GeographySearchItem, PostcodeSearchItem } from "../types";
import type { SvelteSubject } from "../util/rxUtil";
import { appBasePath } from "../env";

export const composeAreaSearch = (query: SvelteSubject<string>): Observable<AreaSearchItem[]> =>
  query.pipe(
    debounceTime(400),
    map((q) => q.trimStart()),
    distinctUntilChanged(),
    switchMap((q) => {
      if (q.length < 3) {
        return of([]);
      } else {
        const geographies = fromFetch(`${appBasePath}/geo?q=${q}`).pipe(
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
