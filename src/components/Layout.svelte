<script>
  import Header from "./Header.svelte";
  import Map from "./Map.svelte";
  import MapTips from "./MapTips.svelte";
  import MapLegend from "./MapLegend.svelte";
  import { page } from "$app/stores";
  import { getSelectedGeography } from "../helpers/categoryHelpers";
  import { setSelectedGeographyStore } from "../data/setSelectedGeographyStore";

  $: if ($page) {
    const g = getSelectedGeography($page.url);
    setSelectedGeographyStore(g.geoCode);
  }
</script>

<div class="inset-0 lg:absolute lg:flex flex-col text-onsblack">
  <Header />
  <div class="flex-1 flex flex-col-reverse lg:flex-row overflow-y-auto ">
    <div class="flex-1 grow-[4] min-w-[30rem] overflow-y-auto">
      <slot />
    </div>
    <div class="flex-1 grow-[7] relative">
      <Map />
      <MapTips />
      <MapLegend />
    </div>
  </div>
</div>
