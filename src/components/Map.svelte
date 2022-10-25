<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { page } from "$app/stores";
  import { initMap } from "../map/initMap";
  import { appParamsStore, vizLoaded } from "../stores/stores";
  import { resetMapViz } from "../map/resetMapViz";

  let map;
  let mapContainer;

  onMount(() => {
    map = initMap(mapContainer);
  });
  onDestroy(() => {
    if (map) map.remove();
    map = undefined;
  });

  // Reset the loaded map feature states when category changes
  function resetStates(page) {
    if (map && page) {
      const catCode = page.params.category;
      if ($vizLoaded && catCode != $vizLoaded.catCode) {
        console.log("resetting feature states", catCode, $vizLoaded.catCode);
        resetMapViz(map, $vizLoaded);
        vizLoaded.set({
          catCode: catCode,
          geoCodes: { lad: new Set([]), msoa: new Set([]), oa: new Set([]) },
        });
      }
    }
  }
  $: resetStates($page);
</script>

<div
  class="w-full lg:h-full"
  class:h-[34rem]={!$appParamsStore.embed}
  class:h-full={$appParamsStore.embed}
  bind:this={mapContainer}
/>
