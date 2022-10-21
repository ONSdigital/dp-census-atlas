<script>
  import Header from "./Header.svelte";
  import Map from "./Map.svelte";
  import MapTips from "./MapTips.svelte";
  import MapLegend from "./MapLegend.svelte";
  import OnsAnalyticsBanner from "./OnsAnalyticsBanner.svelte";
  import { appParamsStore } from "../stores/stores";

  export let hideMapOnMobile = true;

  // Google Analytics
  const analyticsId = "GTM-MBCBVQS";
  const analyticsProps = {
    contentTitle: "Census maps",
    releaseDate: "20221018",
    contentType: "exploratory",
  };
</script>

<OnsAnalyticsBanner {analyticsId} {analyticsProps} />

<div class="inset-0 absolute lg:flex flex-col min-w-[370px] text-onsblack" class:flex={$appParamsStore.embed}>
  <Header />
  <div class="flex-1 flex flex-col-reverse lg:flex-row overflow-y-auto">
    <div
      class="flex-1 grow-[3] lg:min-w-[25rem] xl:min-w-[30rem] xl:max-w-[35rem] overflow-y-auto flex flex-col"
      class:hidden={$appParamsStore.embed}
    >
      <slot />
    </div>
    <div class:hidden={hideMapOnMobile} class="lg:block flex-1 grow-[7] relative">
      <Map />
      <MapTips />
      <MapLegend />
    </div>
  </div>
</div>
