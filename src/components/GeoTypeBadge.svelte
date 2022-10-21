<script lang="ts">
  import type { GeoType } from "../types";

  export let geoType: GeoType;
</script>

{#if geoType && geoType !== "ew"}
  <span class="text-xs md:text-sm bg-ons-census text-white font-bold px-1 rounded-sm mx-0 md:mx-1 mb-5">
    {geoType.toUpperCase()}
  </span>
{/if}
