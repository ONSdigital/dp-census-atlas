<script lang="ts">
  import type { GeoType } from "../types";

  export let geoType: GeoType;
</script>

{#if geoType && geoType !== "ew"}
  <span class="text-sm bg-ons-census text-white font-bold px-1 rounded-sm mx-1 align-text-top">
    {geoType.toUpperCase()}
  </span>
{/if}
