<script lang="ts">
  let q = "";

  import { timer } from "rxjs";
  let tick = timer(0, 1000);

  import { of } from "rxjs";
  import { fromFetch } from "rxjs/fetch";
  import { catchError, switchMap, startWith, debounceTime } from "rxjs/operators";
  import { SvelteSubject } from "../util/rxUtil";

  const query = new SvelteSubject("");

  const results = query.pipe(
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
</script>

<div class="">
  Tick: {$tick}
</div>
<div class="flex max-w-[25rem]">
  <input
    bind:value={$query}
    id="area-input"
    name="area-input"
    type="search"
    autocomplete="off"
    class="flex items-center justify-center h-12 p-2 w-full border-l-2 border-t-2 border-b-2 border-black focus:border-4 custom-ring"
  />

  <button tabindex="-1" type="submit" class="bg-onsblue px-3">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6 text-white "
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="3"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  </button>
</div>
<div class="mt-2 text-sm text-onsdark">For example, your home town, a postcode or district</div>

<div class="p-5">
  <pre>{q}</pre>
</div>
<div class="p-5">
  <pre>{JSON.stringify($results, ["tv_shows", "id", "name"], 2)}</pre>
</div>
