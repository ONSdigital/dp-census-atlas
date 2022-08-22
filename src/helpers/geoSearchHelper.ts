import { of, zip, type Observable } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import {
  filter,
  catchError,
  switchMap,
  mergeMap,
  map,
  startWith,
  debounceTime,
  distinctUntilChanged,
  tap,
} from "rxjs/operators";
import type { GeoSearchItem } from "../types";
import type { SvelteSubject } from "../util/rxUtil";

export const setupGeoSearch = (query: SvelteSubject<string>): Observable<GeoSearchItem> => {
  return query.pipe(
    debounceTime(400),
    distinctUntilChanged(),
    switchMap((q) => {
      if (q.length > 2) {
        return zip(
          fromFetch(`https://api.postcodes.io/postcodes/${q}/autocomplete`).pipe(
            mergeMap((response) => response.json()),
            map((json) => json.result ?? []),
          ),
          fromFetch(`/geo?q=${q}`).pipe(mergeMap((response) => response.json())),
        ).pipe(
          map(([postcodes, geographies]) => {
            console.log("postcodes:", postcodes);
            console.log("geographies:", geographies);
          }),
        );
      } else {
        return of([]);
      }
    }),
    tap(console.log),
  );
};

// const searchPostcodes = async (q: string) => {
//   if (q.length > 2) {
//     const res = await fetch(`https://api.postcodes.io/postcodes/${q}/autocomplete`);
//     return await res.json();
//   } else {
//     return new Promise();
//   }
// };
