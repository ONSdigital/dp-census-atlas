import { of } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { catchError, switchMap, startWith, debounceTime } from "rxjs/operators";
import type { SvelteSubject } from "../util/rxUtil";

export const setupGeoSearch = (query: SvelteSubject<string>) => {
  return query.pipe(
    debounceTime(350),
    switchMap((q) => {
      if (!q) {
        return of([]);
      }
      return fromFetch(`https://www.episodate.com/api/search?q=${q}`).pipe(
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
