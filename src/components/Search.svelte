<script type="text/javascript" lang="ts">
  import ONSAutoSuggest from "./ons/ONSAutoSuggest.svelte";
  import ONSError from "./ons/ONSError.svelte";

  import { handleLocationSelect } from "../helpers/locationSelectHelper";
  import type { GeographyAutoSuggestProps } from "../types";

  export let id: string = "search-field";
  export let label: string = "";
  export let button: string = "Choose";
  export let title: string = "Search by area";
  export let error: string = "Error";
  export let header: boolean = false;
  export let invert: boolean = undefined;
  export let padding: boolean = undefined;
  export let onClose: () => void = undefined;

  let userInputValue;
  let userInputMeta;
  let renderError = false;
  let invertTextColor = invert;

  const handleOnClick = async (value: GeographyAutoSuggestProps) => {
    renderError = false;
    invertTextColor = invert;
    if (value) {
      const { geoCode, geoType } = value;
      handleLocationSelect({ geoCode, geoType: geoType.toLowerCase() });
      onClose();
    } else {
      renderError = true;
      invertTextColor = false;
    }
  };
</script>

<div class="component-margin--2">
  {#if !header}
    <h2 class={`ons-u-mb-xs ${invert ? "invert" : ""}`}>{title}</h2>
  {/if}
  <ONSError errorText={error} {id} {renderError}>
    <div class={`ons-field ${padding ? "tw-pb-8" : ""}`}>
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
  .invert {
    color: var(--color-white);
  }
</style>
