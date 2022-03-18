<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { initMap } from "../map/initMap";

  let map;
  let mapContainer;

  onMount(() => {
    map = initMap(mapContainer);
  });
  onDestroy(() => {
    if (map) map.remove();
  });
</script>

<div class="w-full h-[20rem] xl:h-full" bind:this={mapContainer} />
