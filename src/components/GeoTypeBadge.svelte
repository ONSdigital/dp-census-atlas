<script lang="ts">
  import type { GeoType } from "../types";

  export let geoType: GeoType;
</script>

{#if geoType && geoType !== "ew"}
  <div
    class="inline-block align-middle text-xs md:text-sm bg-ons-census text-white font-bold px-1 rounded-sm mx-0 md:mx-1 -mt-0.5 lg:-mt-1"
  >
    {geoType.toUpperCase()}
  </div>
{/if}
