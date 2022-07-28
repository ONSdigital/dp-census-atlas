<script lang="ts">
  import { englandAndWales } from "../helpers/spatialHelper";
  import { selectedGeographyStore } from "../stores/stores";
  import Icon from "./MaterialIcon.svelte";
  import { deselectGeography } from "../helpers/geographyHelper";

  $: selectedGeographyDisplayName = $selectedGeographyStore?.displayName;
  $: selectedGeographyGeoType = $selectedGeographyStore?.geoType.toUpperCase();

  const resetSelectedGeography = () => {
    deselectGeography();
  };

  let q = "";

  $: open = false;
  const toggleOpen = () => {
    open = !open;
  };
  $: openOrCloseAreaSearchPanelText = open ? "Close area search panel" : "Open area search panel";
</script>

<section class="py-3 border-b-2">
  <h2 class="font-bold text-slate-500">Area</h2>
  <!-- nested buttons are invalid html, so workaround with a clickable label -->
  <label for="area-input" on:click={toggleOpen} class="group w-full text-left hoverable custom-ring">
    <div class="flex items-center gap-1">
      <div class="text-xl">
        {selectedGeographyDisplayName}
      </div>
      {#if selectedGeographyGeoType !== "EW"}
        <div class="ml-1 text-sm bg-ons-census text-white font-bold px-1 rounded-sm">
          {selectedGeographyGeoType}
        </div>
        <button
          on:click={resetSelectedGeography}
          title="Clear selected area"
          aria-label="Clear selected area"
          class="flex ml-2.5 text-2xl hover:scale-105 custom-ring bg-ons-grey-15 hover:bg-ons-grey-35 rounded"
        >
          <Icon kind="close" />
        </button>
      {/if}
      <button
        class="ml-auto custom-ring"
        title={openOrCloseAreaSearchPanelText}
        aria-label={openOrCloseAreaSearchPanelText}
      >
        <div class="text-2xl group-hover:scale-125 transition-all">
          <Icon kind="arrowForwardIos" orientation={open ? "w" : "e"} />
        </div>
      </button>
    </div>
  </label>

  {#if open}
    <div class="mt-3 mb-1">
      <div class="flex max-w-[25rem]">
        <input
          id="area-input"
          name="area-input"
          type="search"
          autocomplete="off"
          class="flex items-center justify-center h-12 p-2 w-full border-l-2 border-t-2 border-b-2 border-black focus:border-4 custom-ring"
          bind:value={q}
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
    </div>
  {/if}
</section>
