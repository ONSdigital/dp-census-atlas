<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { initMap } from "../map/initMap";
  import { appParamsStore } from "../stores/stores";

  let map;
  let mapContainer;

  onMount(() => {
    map = initMap(mapContainer);
  });
  onDestroy(() => {
    if (map) map.remove();
  });
</script>

<div
  class="w-full lg:h-full"
  class:h-[34rem]={!$appParamsStore.embed}
  class:h-full={$appParamsStore.embed}
  bind:this={mapContainer}
/>
