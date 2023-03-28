<script lang="ts">
  import { tooltip } from "../actions/tooltip";
  import { page } from "$app/stores";
  import { nav } from "../stores/nav";
  import { geography } from "../stores/geography";
  import AreaSearch from "./AreaSearch.svelte";
  import Icon from "./MaterialIcon.svelte";
  import { deselectGeography } from "../helpers/navigationHelper";
  import { geoTypeSingularDescriptions } from "../helpers/geographyHelper";

  $: open = false;
  const toggleOpen = () => {
    open = !open;
  };
  $: openOrCloseAreaSearchPanelText = open ? "Close area search" : "Open area search";

  const resetSelectedGeography = () => {
    deselectGeography($page.url.searchParams);
  };
</script>

<section class="py-2.5 border-b-2">
  <h2 class="font-bold text-slate-500">Area</h2>
  <!-- nested buttons are invalid html, so workaround with a clickable label -->
  <!-- svelte-ignore a11y-click-events-have-key-events (this is an *additonal* touch area to the interactive button) -->
  <label for="area-input" on:click={toggleOpen} class="group w-full text-left hoverable custom-ring">
    <div class="flex items-center gap-1">
      <div class="text-xl">
        {$geography.displayName}
      </div>
      {#if $geography?.geoType.toUpperCase() !== "EW"}
        <div
          class="ml-1 text-sm bg-ons-census text-white font-bold px-1 rounded-sm"
          use:tooltip={{ content: geoTypeSingularDescriptions[$geography.geoType], placement: "bottom" }}
          title={geoTypeSingularDescriptions[$geography.geoType]}
        >
          {$geography.geoType.toUpperCase()}
        </div>
        <button
          use:tooltip
          on:click={resetSelectedGeography}
          title="Clear selected area"
          aria-label="Clear selected area"
          class="flex ml-2.5 text-2xl hover:scale-105 custom-ring bg-ons-grey-15 hover:bg-ons-grey-35 rounded"
        >
          <Icon kind="close" />
        </button>
      {/if}
      <button
        use:tooltip={{ content: "Toggle area seach" }}
        class="ml-auto custom-ring"
        title={openOrCloseAreaSearchPanelText}
        aria-label={openOrCloseAreaSearchPanelText}
      >
        <div class="text-2xl group-hover:scale-125 transition-all ml-2">
          <Icon kind="arrowForwardIos" orientation={open ? "w" : "e"} />
        </div>
      </button>
    </div>
  </label>

  <div class="mt-3 mb-1" style:display={open ? "block" : "none"}>
    <AreaSearch
      onSelected={() => {
        open = false;
        nav.set({ open: false });
      }}
    />
  </div>
</section>
