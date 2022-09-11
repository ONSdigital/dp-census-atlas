<script lang="ts">
  import Select from "svelte-select";
  import { SvelteSubject } from "../util/rxUtil";
  import { composeAreaSearch } from "../helpers/areaSearchHelper";
  import { highlightText } from "../helpers/searchCensusHelper";
  import { selectGeography } from "../helpers/geographyHelper";
  import type { GeographySearchItem, PostcodeSearchItem } from "../types";
  import { appBasePath } from "../env";

  const query = new SvelteSubject("");
  const results = composeAreaSearch(query);

  $: noOptionsMessage = $query.length < 3 ? "Type for suggestions..." : "";
  async function handleSelect(event) {
    if (event?.detail?.kind === "Geography") {
      const geo = event.detail as GeographySearchItem;
      selectGeography(geo);
    } else if (event?.detail?.kind === "Postcode") {
      const postcode = event.detail as PostcodeSearchItem;
      let res = await fetch(`https://api.postcodes.io/postcodes/${postcode.value}`);
      let details = await res.json();
      console.log(details);
      let geoRes = await fetch(`${appBasePath}/geo?q=${details.result.admin_district}`);
      let geos = await geoRes.json();
      console.log(geos);
      if (geos.length > 0) {
        selectGeography(geos[0]);
      }
    }
  }
</script>

<div class="themed max-w-[25rem]">
  <Select
    placeholder=""
    bind:filterText={$query}
    items={$results}
    optionIdentifier="value"
    labelIdentifier="value"
    on:select={handleSelect}
    containerClasses=""
    {noOptionsMessage}
  />
</div>
<!-- <div class="">{query2}</div> -->
<!-- <div class="flex max-w-[25rem]">
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
</div> -->

<!-- {#if $results && $results.length}
  <div class="relative">
    <div
      class="absolute left-0 right-0 z-50 max-h-[30rem] overflow-y-auto p-3 pt-2 border-[1px] border-slate-600 bg-white"
    >
      <ul>
        {#each $results as r}
          {#if r.kind === "Geography"}
            <li class="mb-1 border-b-[1px] border-b-slate-300 ">
              <button class="block py-2 px-1 custom-ring">
                {@html highlightText(r.en, $query)}
              </button>
            </li>
          {/if}
          {#if r.kind === "Postcode"}
            <li class="mb-1 border-b-[1px] border-b-slate-300 ">
              <button class="block py-2 px-1 custom-ring">
                {@html highlightText(r.value, $query)}
              </button>
            </li>
          {/if}
        {/each}
      </ul>
      <div class="pt-3 pb-1 px-1 ">
        {$results.length}
        results
      </div>
    </div>
  </div>
{/if} -->

<div class="mt-2 text-sm text-onsdark">For example, your home town, a postcode or district</div>

<!-- <div class="p-5">
  <pre>{JSON.stringify($results)}</pre>
</div> -->
<style>
  .themed {
    --border: 2px solid black;
    --borderHoverColor: black;
    --borderFocusColor: black;
    --borderRadius: 2px;
    --height: 3rem;
  }
</style>
