<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { initMap } from "../map/initMap";
  import { appParamsStore } from "../stores/stores";

  let map;
  let mapContainer;

  onMount(() => {
    /* Svelte issue: Runs twice locally causing a map flicker issue: https://github.com/sveltejs/kit/issues/2130 */
    /* Fixed once the project is built */
    map = initMap(mapContainer);
  });
  onDestroy(() => {
    if (map) map.remove();
  });
</script>

<div class="w-full lg:h-full" class:h-full={$appParamsStore.embed} bind:this={mapContainer} />
