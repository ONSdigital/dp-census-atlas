import { type Observable, of, forkJoin, tap } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { switchMap, mergeMap, map, debounceTime, distinctUntilChanged } from "rxjs/operators";
import type { GeoSearchItem } from "../types";
import type { SvelteSubject } from "../util/rxUtil";
import { appBasePath } from "../env";

export const setupGeoSearch = (query: SvelteSubject<string>): Observable<GeoSearchItem> => {
  return query.pipe(
    debounceTime(400),
    distinctUntilChanged(),
    switchMap((q) => {
      if (q.length > 2) {
        const geographies = fromFetch(`${appBasePath}/geo?q=${q}`).pipe(mergeMap((response) => response.json()));
        const postcodes = fromFetch(`https://api.postcodes.io/postcodes/${q}/autocomplete`).pipe(
          mergeMap((response) => response.json()),
          map((json) => json.result ?? []),
        );
        return forkJoin({
          geographies,
          postcodes,
        }).pipe(
          map(({ geographies, postcodes }) => {
            return geographies
              .map((geo) => ({ kind: "Geography", ...geo }))
              .concat(postcodes.map((postcode) => ({ kind: "Postcode", value: postcode })));
          }),
        );
      } else {
        return of([]);
      }
    }),
    tap(console.log),
  );
};
