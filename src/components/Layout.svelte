<script>
  import Header from "./Header.svelte";
  import Map from "./Map.svelte";
  import BreaksChart from "./BreaksChart.svelte";
  import MapLegend from "./MapLegend.svelte";
  import { page } from "$app/stores";
  import { getSelectedGeography } from "../helpers/categoryHelpers";
  import { setSelectedGeographyStore } from "../data/setSelectedGeographyStore";

  $: if ($page) {
    const g = getSelectedGeography($page.url);
    setSelectedGeographyStore({ geoCode: g.geoCode, geoType: g.geoType });
  }
</script>

<div class="inset-0 lg:absolute lg:flex flex-col">
  <Header />
  <div class="flex-1 flex flex-col-reverse lg:flex-row overflow-y-auto ">
    <div class="flex-1 grow-[4] min-w-[30rem] overflow-y-auto">
      <slot />
    </div>
    <div class="flex-1 grow-[7] relative">
      <Map />
      <MapLegend />
    </div>
  </div>
</div>
