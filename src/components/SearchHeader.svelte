<script lang="ts">
  import { _ } from "svelte-i18n";
  import { selectedGeographyStore } from "../stores/stores";

  import { setGeoSearchParam } from "../helpers/queryParamsHelper";

  import Search from "./Search.svelte";

  $: selectedGeographyGeoType = $selectedGeographyStore?.geoType;

  export let onClose: () => void;
</script>

<div class="search-container tw-relative tw-pt-8">
  <div class="close-button tw-w-20 tw-h-8 tw-flex tw-justify-center tw-items-center tw-absolute tw-top-0 tw-right-0">
    <button class="close-link tw-flex tw-gap-2 tw-items-center" on:click={onClose}
      >{$_("search.close")}
      <svg
        class="ons-svg-icon"
        width="19"
        height="17"
        viewBox="0 0 19 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.31707 10.5509L18.3902 2.09375L16.258 0.106323L9.31707 6.56194L2.37609 0.106323L0.243897 2.09375L9.31707 10.5509Z"
          fill="white"
        />
        <path
          d="M9.31707 6.44931L0.243896 14.9064L2.37609 16.8939L9.31707 10.4383L16.258 16.8939L18.3902 14.9064L9.31707 6.44931Z"
          fill="white"
        />
      </svg>
    </button>
  </div>
  <div class="ons-container">
    <Search
      title={$_("search.title")}
      label={$_("search.label")}
      button={$_("search.button")}
      error={$_("search.error")}
      invert
      padding
      onClose={() => onClose()}
    />
    <div class="tw-pb-6">
      {#if selectedGeographyGeoType !== "ew"}
        <button
          class="tw-underline"
          on:click={() => {
            setGeoSearchParam({ geoType: "ew", geoCode: "K04000001" });
            onClose();
          }}>{$_("search.reset")}</button
        >
      {/if}
    </div>
  </div>
</div>

<style lang="scss">
  @import "../../node_modules/@ons/design-system/scss/vars/_index.scss";
  .search-container {
    background-color: $color-ocean-blue;
  }
  button {
    color: $color-white;
  }
  .close-button {
    background-color: $color-night-blue;
  }
</style>
