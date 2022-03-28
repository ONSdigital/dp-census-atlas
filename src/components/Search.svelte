<script lang="ts">
  import ONSAutoSuggest from "./ons/ONSAutoSuggest.svelte";
  import ONSError from "./ons/ONSError.svelte";

  import { selectedGeographyStore } from "../stores/stores";
  import { setGeoSearchParam } from "../helpers/queryParamsHelper";
  import type { GeographyAutoSuggestProps } from "../types";

  export let id: string = "search-field";
  export let label: string = "";
  export let button: string = "Choose";
  export let title: string = "Search by area";
  export let error: string = "Error";
  export let header: boolean = false;

  let userInputValue;
  let userInputMeta;
  let renderError = false;
  let invertTextColor = false;

  const handleOnClick = async (value: GeographyAutoSuggestProps) => {
    renderError = false;
    invertTextColor = false;
    if (value) {
      const { en, geoCode, geoType, bbox } = value;
      selectedGeographyStore.set({
        geoType: geoType.toLowerCase(),
        displayName: en,
        geoCode,
        bbox,
      });
      setGeoSearchParam({ geoCode, geoType: geoType.toLowerCase() });
    } else {
      renderError = true;
      invertTextColor = true;
    }
  };
</script>

<div class="component-margin--2">
  {#if !header}
    <h2 class="ons-u-mb-xs">{title}</h2>
  {/if}
  <ONSError errorText={error} {id} {renderError}>
    <div class="ons-field">
      <ONSAutoSuggest
        labelText={label}
        {invertTextColor}
        {id}
        autosuggestData={"/geoLookup.json"}
        {renderError}
        {header}
        bind:autosuggestValue={userInputValue}
        bind:autosuggestMeta={userInputMeta}
      />
      <button on:click={() => handleOnClick(userInputMeta)} type="submit" class="ons-btn ons-u-mt-s ons-btn--small">
        <span class="ons-btn__inner">{button}</span>
      </button>
    </div>
  </ONSError>
</div>

<style>
  .component-margin--2 {
    margin-bottom: 2rem;
  }
</style>
