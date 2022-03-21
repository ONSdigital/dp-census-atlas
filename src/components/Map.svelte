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

<div class="tw-w-full tw-h-[20rem] xl:tw-h-full" bind:this={mapContainer} />
