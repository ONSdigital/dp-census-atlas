<script>
  import Header from "./Header.svelte";
  import Map from "./Map.svelte";
  import MapTips from "./MapTips.svelte";
  import MapLegend from "./MapLegend.svelte";
  import { appParamsStore } from "../stores/stores";
</script>

<div class="inset-0 lg:absolute lg:flex flex-col text-onsblack">
  <Header />
  <div class="flex-1 flex flex-col-reverse lg:flex-row overflow-y-auto ">
    <div class="flex-1 grow-[4] min-w-[30rem] max-w-[35rem] overflow-y-auto" class:hidden={$appParamsStore.embed}>
      <slot />
    </div>
    <div class="flex-1 grow-[7] relative">
      <Map />
      <MapTips />
      <MapLegend />
    </div>
  </div>
</div>
