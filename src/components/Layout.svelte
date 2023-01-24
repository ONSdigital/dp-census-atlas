<script>
  import { params } from "../stores/params";
  import { nav } from "../stores/nav";
  import Header from "./Header.svelte";
  import EmbeddedHeader from "./EmbeddedHeader.svelte";
  import Map from "./Map.svelte";
  import MapControls from "./MapControls.svelte";
  import MapTips from "./MapTips.svelte";
  import MapLegend from "./MapLegend.svelte";
  import MapLegendChangeOverTime from "./MapLegendChangeOverTime.svelte";
  import Heading from "./Heading.svelte";
  import OnsAnalyticsBanner from "./OnsAnalyticsBanner.svelte";
  import Toggle from "./Toggle.svelte";

  // Google Analytics
  const analyticsId = "GTM-MBCBVQS";
  const analyticsProps = {
    contentTitle: "Census maps",
    releaseDate: "20221102",
    contentType: "exploratory",
    outputSeries: "censusmaps",
  };
</script>

<!-- outer -->
<div class="absolute inset-0 flex flex-col min-w-[340px] text-ons-black text-sm md:text-base">
  <OnsAnalyticsBanner {analyticsId} {analyticsProps} />
  <Header />
  <!-- main -->
  <div class={`grow flex relative overflow-hidden`}>
    <!-- svelte-ignore a11y-click-events-have-key-events (this is an *additonal* touch area to dismiss the nav) -->
    <div
      class={`lg:hidden bg-ons-black absolute inset-0 z-20 cursor-pointer transition-opacity ${
        $nav.open ? "visible opacity-50" : "invisible opacity-0"
      }`}
      on:click={() => {
        nav.set({ open: false });
      }}
    />
    <!-- nav -->
    <div
      class={`absolute flex inset-0 right-[3rem] sm:right-[5rem] md:right-[7rem] lg:relative lg:w-[27rem] xl:w-[32rem] transition-transform transform-gpu z-20 ${
        !$nav.open && $params.category ? "-translate-x-full delay-500" : ""
      } lg:translate-x-0 ${!$params.category ? "right-0 sm:right-0 md:right-0" : ""}`}
    >
      <div class="grow flex flex-col overflow-y-auto bg-ons-white">
        <EmbeddedHeader />
        <Heading />
        <slot />
      </div>
      <!-- toggle -->
      {#if !$params.embed}
        <div class="lg:hidden absolute inset-0 left-[100%] my-auto h-24" class:hidden={!$params.category}>
          <Toggle />
        </div>
      {/if}
    </div>
    <!-- map -->
    <div class="grow relative">
      <Map />
      <MapControls />
      <MapTips />
      {#if $params.changeOverTime && $params.classification?.comparison_2011_data_available_geotypes}
        <MapLegendChangeOverTime />
      {:else}
        <MapLegend />
      {/if}
    </div>
  </div>
</div>

<svelte:window
  on:keydown={(e) => {
    if ($nav.open && e.code === "Escape") {
      nav.set({ open: false });
    }
  }}
/>
