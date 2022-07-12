<script lang="ts">
  import { _ } from "svelte-i18n";
  import { selectedGeographyStore } from "../stores/stores";

  import { handleLocationSelect } from "../helpers/locationSelectHelper";

  import Search from "./Search.svelte";
  import Button from "./Button.svelte";
  import { englandAndWales } from "../helpers/spatialHelper";

  $: selectedGeographyGeoType = $selectedGeographyStore?.geoType;

  export let onClose: () => void;
</script>

<div class="bg-onsblue relative pt-8">
  <div class="absolute top-0 right-0">
    <Button label={$_("search.close")} icon="close" onClick={onClose} />
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
    <div class="pb-6">
      {#if selectedGeographyGeoType !== "ew"}
        <button
          class="underline text-white"
          on:click={() => {
            handleLocationSelect({ geoType: englandAndWales.meta.geotype, geoCode: englandAndWales.meta.code });
            onClose();
          }}>{$_("search.reset")}</button
        >
      {/if}
    </div>
  </div>
</div>
