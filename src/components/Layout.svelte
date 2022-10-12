<script>
  import Loading from "./Loading.svelte";
  import ServiceUnavailablePage from "./ServiceUnavailablePage.svelte";
  import Header from "./Header.svelte";
  import Map from "./Map.svelte";
  import MapTips from "./MapTips.svelte";
  import MapLegend from "./MapLegend.svelte";
  import { appParamsStore, contentStore } from "../stores/stores";

  export let hideMapOnMobile = true;
</script>

{#if $contentStore}
  {#if $contentStore.variableGroups.length > 0}
    <div class="inset-0 absolute lg:flex flex-col text-onsblack" class:flex={$appParamsStore.embed}>
      <Header />
      <div class="flex-1 flex flex-col-reverse lg:flex-row overflow-y-auto">
        <div
          class="flex-1 grow-[4] lg:min-w-[30rem] lg:max-w-[35rem] overflow-y-auto flex flex-col"
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
  {:else}
    <ServiceUnavailablePage />
  {/if}
{:else}
  <Loading />
{/if}
