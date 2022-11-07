<script lang="ts">
  import { page } from "$app/stores";
  import Select from "./Select.svelte";
  import { SvelteSubject } from "../util/rxUtil";
  import { composeAreaSearch, getOAfromLngLat } from "../helpers/areaSearchHelper";
  import { selectGeography } from "../helpers/navigationHelper";
  import type { GeographySearchItem, PostcodeSearchItem } from "../types";

  export let embedded = false;

  const query = new SvelteSubject("");
  const results = composeAreaSearch(query);

  async function handleSelect(event) {
    if (event?.detail?.kind === "Geography") {
      const geo = event.detail as GeographySearchItem;
      selectGeography($page.url.searchParams, geo);
    } else if (event?.detail?.kind === "Postcode") {
      const postcode = event.detail as PostcodeSearchItem;
      let detailsRes = await fetch(`https://api.postcodes.io/postcodes/${postcode.value}`);
      let details = await detailsRes.json();
      let geoCode = await getOAfromLngLat(details.result.longitude, details.result.latitude);
      if (geoCode) {
        selectGeography($page.url.searchParams, { geoType: "oa", geoCode });
      }
    }
  }
</script>

<div class="themed max-w-[30rem]">
  <Select
    id="area-input"
    mode="search"
    placeholder="Search England and Wales"
    bind:filterText={$query}
    items={$results}
    idKey="value"
    labelKey="value"
    groupKey="geoType"
    on:select={handleSelect}
    autoClear
  />
</div>

{#if !embedded}
  <div class="mt-2 text-sm text-onsdark">For example, your home town, a postcode or district</div>
{/if}

<style>
  .themed {
    --border: 2px solid black;
    --borderHoverColor: black;
    --borderFocusColor: black;
    --borderRadius: 2px;
    --height: 3rem;
  }
</style>
