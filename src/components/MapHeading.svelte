<script lang="ts">
  //   import Icon from "./MaterialIcon.svelte";
  import AreaSearch from "./AreaSearch.svelte";
  import { GeoTypes } from "../types";
  import { geoTypeDescriptions } from "../helpers/geographyHelper";
  import { params } from "../stores/params";
  import { viewport, type Viewport } from "../stores/viewport";
  //   import { commands } from "../stores/commands";

  //   const geoTypes = GeoTypes.filter((g) => g !== "ew");
</script>

{#if $viewport}
  <div
    class="absolute top-3 lg:top-5 xl:top-8 left-3 lg:left-5 xl:left-8 pr-16 lg:pr-20 min-w-[370px] md:min-w-[600px]"
  >
    <div class="flex flex-wrap items-center gap-2 text-sm lg:text-base mb-3">
      <div class="flex group">
        <div class="z-abovemap px-3 py-1 rounded-l bg-ons-census text-ons-grey-5 font-bold">
          {$viewport.geoType.toUpperCase()}
        </div>
        <div class={`z-abovemap px-3 py-1 rounded-r bg-ons-grey-75 text-ons-grey-5 `}>
          {geoTypeDescriptions[$viewport.geoType]}
        </div>
      </div>

      <!--
      {#each geoTypes as g, i}
        {#if i !== 0}
          <div
            class="text-xl text-ons-grey-100 select-none"
            class:hidden={i > geoTypes.indexOf($viewport.idealGeoType)}
          >
            <Icon kind="arrowRightAlt" />
          </div>
        {/if}
        <button
          class="flex group"
          on:click={() => commands.set({ kind: "zoom", geoType: g })}
          disabled={i >= geoTypes.indexOf($viewport.geoType)}
          class:opacity-70={i > geoTypes.indexOf($viewport.geoType)}
          class:hidden={i > geoTypes.indexOf($viewport.idealGeoType)}
        >
          <div
            class="z-abovemap px-3 py-1 rounded-l bg-ons-census text-ons-grey-5 font-bold"
            class:bg-ons-grey-55={g !== $viewport.geoType}
            class:group-hover:bg-ons-census={i < geoTypes.indexOf($viewport.geoType)}
            class:bg-ons-census={g === $viewport.geoType}
          >
            {g.toUpperCase()}
          </div>
          <div
            class={`z-abovemap px-3 py-1 rounded-r bg-ons-grey-75 text-ons-grey-5 `}
            class:group-hover:bg-ons-grey-55={i < geoTypes.indexOf($viewport.geoType)}
          >
            {geoTypeDescriptions[g]}
            {#if i > geoTypes.indexOf($viewport.geoType)}
              <span class="">not available</span>
            {/if}
          </div>
        </button>
      {/each}
      -->
    </div>

    {#if $params?.embed?.areaSearch}
      <div class="lg:mt-6">
        <AreaSearch embedded />
      </div>
    {/if}
  </div>
{/if}
