<script>
  import Header from "./Header.svelte";
  import Map from "./Map.svelte";
  import MapControls from "./MapControls.svelte";
  import MapTips from "./MapTips.svelte";
  import MapLegend from "./MapLegend.svelte";
  import Heading from "./Heading.svelte";
  import OnsAnalyticsBanner from "./OnsAnalyticsBanner.svelte";
  import { params } from "../stores/params";

  // Google Analytics
  const analyticsId = "GTM-MBCBVQS";
  const analyticsProps = {
    contentTitle: "Census maps",
    releaseDate: "20221102",
    contentType: "exploratory",
    outputSeries: "censusmaps",
  };
</script>

<div class="inset-0 absolute lg:flex flex-col min-w-[370px] text-onsblack" class:flex={$params.embed}>
  <OnsAnalyticsBanner {analyticsId} {analyticsProps} />
  <Header />
  <div class="flex-1 flex flex-col lg:flex-row overflow-y-auto" class:flex-col-reverse={$params.category}>
    <div
      class="flex-1 grow-[3] lg:min-w-[25rem] xl:min-w-[30rem] xl:max-w-[35rem] overflow-y-auto flex flex-col"
      class:hidden={$params.embed}
    >
      <Heading />
      <slot />
    </div>
    <div class="lg:block flex-1 grow-[7] relative">
      <Map />
      <MapControls />
      <MapTips />
      <MapLegend />
    </div>
  </div>
</div>
