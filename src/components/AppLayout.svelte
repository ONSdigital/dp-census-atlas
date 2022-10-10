<script>
  import FakeDataHeader from "./FakeDataHeader.svelte";
  import Header from "./FakeDataHeader.svelte";
  import Map from "./Map.svelte";
  import MapTips from "./MapTips.svelte";
  import MapLegend from "./MapLegend.svelte";
  import { appParamsStore, contentStore } from "../stores/stores";
</script>

<div class="inset-0 lg:absolute lg:flex flex-col text-onsblack">
  {#if $contentStore.fakeDataLoaded}
    <FakeDataHeader />
  {:else}
    <Header />
  {/if}
  <div class="flex-1 flex flex-col-reverse lg:flex-row overflow-y-auto ">
    <div
      class="flex-1 grow-[4] min-w-[30rem] max-w-[35rem] overflow-y-auto flex flex-col"
      class:hidden={$appParamsStore.embed}
    >
      <slot />
    </div>
    <div class="flex-1 grow-[7] relative">
      <Map />
      <MapTips />
      <MapLegend />
    </div>
  </div>
</div>
