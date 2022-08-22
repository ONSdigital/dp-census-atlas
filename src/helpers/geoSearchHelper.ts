import { of, type Observable } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { filter, catchError, switchMap, map, startWith, debounceTime, distinctUntilChanged, tap } from "rxjs/operators";
import type { GeoSearchItem } from "../types";
import type { SvelteSubject } from "../util/rxUtil";

export const setupGeoSearch = (query: SvelteSubject<string>): Observable<GeoSearchItem> => {
  return query.pipe(
    debounceTime(400),
    distinctUntilChanged(),
    switchMap((q) => {
      if (q.length > 2) {
        return fromFetch(`https://api.postcodes.io/postcodes/${q}/autocomplete`, {
          selector: (res) => res.json(),
        }).pipe(map((json) => json.result));
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
