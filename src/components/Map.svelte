<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { initMap } from "../map/initMap";
  import { params } from "../stores/params";

  let map;
  let mapContainer;

  onMount(() => {
    map = initMap(mapContainer);
  });
  onDestroy(() => {
    if (map) map.remove();
  });
</script>

<div class="w-full lg:h-full" class:h-[34rem]={!$params.embed} class:h-full={$params.embed} bind:this={mapContainer} />
