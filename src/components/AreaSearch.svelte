<script lang="ts">
  import { page } from "$app/stores";
  import Select from "./Select.svelte";
  import { fetchGeoPostcodeSearchItems } from "../helpers/areaSearchHelper";
  import { selectGeography } from "../helpers/navigationHelper";
  import type { GeographySearchItem, PostcodeSearchItem } from "../types";

  export let embedded = false;
  export let onSelected: (() => void) | undefined = undefined;

  async function handleSelect(event) {
    if (event?.detail?.kind === "Geography") {
      const geo = event.detail as GeographySearchItem;
      console.log(geo);
      selectGeography($page.url.searchParams, geo);
    } else if (event?.detail?.kind === "Postcode") {
      const postcode = event.detail as PostcodeSearchItem;
      selectGeography($page.url.searchParams, { geoType: "oa", geoCode: postcode.oa });
    }
    if (onSelected) {
      onSelected();
    }
  }
</script>

<div class="themed max-w-[30rem]">
  <Select
    id="area-input"
    mode="search"
    placeholder="Search England and Wales"
    items={[]}
    loadOptions={fetchGeoPostcodeSearchItems}
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
    --listEmptyPadding: 10px;
  }
  :global(.selectbox .empty) {
    font-size: 90%;
  }
</style>
