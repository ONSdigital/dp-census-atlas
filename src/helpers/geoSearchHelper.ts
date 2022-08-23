import { type Observable, of } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { switchMap, mergeMap, map, debounceTime, distinctUntilChanged, tap, withLatestFrom } from "rxjs/operators";
import type { GeoSearchItem } from "../types";
import type { SvelteSubject } from "../util/rxUtil";

export const setupGeoSearch = (query: SvelteSubject<string>): Observable<GeoSearchItem> => {
  return query.pipe(
    debounceTime(400),
    distinctUntilChanged(),
    switchMap((q) => {
      if (q.length > 2) {
        const postcodes = fromFetch(`https://api.postcodes.io/postcodes/${q}/autocomplete`).pipe(
          mergeMap((response) => response.json()),
          map((json) => json.result ?? []),
        );
        const geographies = fromFetch(`/geo?q=${q}`).pipe(mergeMap((response) => response.json()));
        return postcodes.pipe(
          withLatestFrom(geographies),
          map(([postcodes, geographies]) => {
            return postcodes.concat(geographies.map((geo) => geo.en));
          }),
        );
      } else {
        return of([]);
      }
    }),
    tap(console.log),
  );
};
