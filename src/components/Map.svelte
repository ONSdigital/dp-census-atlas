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

<div bind:this={mapContainer} class="h-full w-full" />
