<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { debounceTime } from "rxjs";
  import { fromResizeObserver } from "../util/rxUtil";
  import { initMap } from "../map/initMap";
  import { params } from "../stores/params";

  let map;
  let mapContainer;

  onMount(() => {
    map = initMap(mapContainer);

    // tell the map if its container changes size
    fromResizeObserver(mapContainer)
      .pipe(debounceTime(500))
      .subscribe(() => {
        map.resize();
      });
  });
  onDestroy(() => {
    if (map) map.remove();
  });
</script>

<div class="w-full h-full" bind:this={mapContainer} />
