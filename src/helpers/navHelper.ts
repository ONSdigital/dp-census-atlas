import { of } from "rxjs";
import type { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, map, mergeMap, tap } from "rxjs/operators";
import type { Nav } from "../stores/nav";

export const composeNavVisibility = (query: Observable<Nav>): Observable<boolean> =>
  query.pipe(
    map((nav) => nav.open),
    distinctUntilChanged(),
    // mergeMap((open) => {
    //   if (open) {
    //     return of(true);
    //   } else {
    //     return of(false).pipe(debounceTime(1000));
    //   }
    // }),
    // tap(console.log),
  );
