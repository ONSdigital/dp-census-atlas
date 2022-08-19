import { Observable, of } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { filter, catchError, switchMap, startWith, debounceTime } from "rxjs/operators";
import type { GeoSearchItem } from "../types";
import type { SvelteSubject } from "../util/rxUtil";

export const setupGeoSearch = (query: SvelteSubject<string>): Observable<GeoSearchItem> => {
  return query.pipe(
    debounceTime(300),
    filter((q) => q.length > 2),
    switchMap((q) => {
      if (!q) {
        return of([]);
      }
      return fromFetch(`https://api.postcodes.io/postcodes/${q}/autocomplete`).pipe(
        switchMap((response) => {
          if (response.ok) {
            return response.json();
          } else {
            return of({ error: true, message: `Error: ${response.status}` });
          }
        }),
        catchError((err) => of({ error: true, message: err.message })),
      );
    }),
    startWith([]),
  );
};
