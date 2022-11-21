<script lang="ts">
  import type { GeoType } from "../types";
  import { geoTypeSingularDescriptions } from "../helpers/geographyHelper";

  export let geoType: GeoType;
</script>

{#if geoType && geoType !== "ew"}
  <div
    class="inline-block align-middle text-xs md:text-sm bg-ons-census text-white font-bold px-1 rounded-sm mx-0 md:mx-[3px] -mt-0.5 lg:-mt-[5px]"
    title={geoTypeSingularDescriptions[geoType]}
  >
    <abbr>{geoType.toUpperCase()}</abbr>
  </div>
{/if}
