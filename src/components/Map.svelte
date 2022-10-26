<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { initMap } from "../map/initMap";
  import { selection } from "../stores/selection";

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
  class:h-[34rem]={!$selection.embed}
  class:h-full={$selection.embed}
  bind:this={mapContainer}
/>
