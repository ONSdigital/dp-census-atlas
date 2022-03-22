<script lang="ts">
  import ONSAutoSuggest from "./ons/ONSAutoSuggest.svelte";
  import ONSError from "./ons/ONSError.svelte";

  import { fetchGeographyLookup } from "../data/fetchGeographyData";
  import { setGeoSearchParam } from "../helpers/queryParamsHelper";
  import type { GeographyLookupProps } from "../types";

  export let id: string = "search-field";
  export let label: string = "";
  export let button: string = "Choose";
  export let title: string = "Search by area";
  export let error: string = "Error";
  export let header: boolean = false;

  const autoSuggest = "https://raw.githubusercontent.com/ONSdigital/census-atlas/master/src/data/ladList.json";

  let userInputValue;
  let renderError = false;
  let invertTextColor = false;

  const handleOnClick = async (value: string) => {
    if (value) {
      fetchGeographyLookup(value)
        .then((response) => {
          const { meta: { code } }: GeographyLookupProps = JSON.parse(response);
          setGeoSearchParam({ geoType: "lad", geoCode: code });
        })
        .catch(() => {
          renderError = true;
          invertTextColor = false;
        });
    } else {
      renderError = true;
      invertTextColor = false;
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
        autosuggestData={autoSuggest}
        {renderError}
        {header}
        bind:autosuggestValue={userInputValue}
      />
      <button on:click={() => handleOnClick(userInputValue)} type="submit" class="ons-btn ons-u-mt-s ons-btn--small">
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
