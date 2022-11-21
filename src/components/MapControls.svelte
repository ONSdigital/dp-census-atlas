<script lang="ts">
  import Icon from "./MaterialIcon.svelte";
  import AreaSearch from "./AreaSearch.svelte";
  import { GeoTypes } from "../types";
  import { geoTypePluralDescriptions } from "../helpers/geographyHelper";
  import { params } from "../stores/params";
  import { viewport, type Viewport } from "../stores/viewport";
  import { commands } from "../stores/commands";

  const geoTypes = GeoTypes.filter((g) => g !== "ew");
</script>

{#if $viewport}
  <div
    class="absolute top-3 lg:top-5 xl:top-8 left-3 lg:left-5 xl:left-8 right-16 lg:right-20 gap-3 flex items-start justify-between flex-wrap"
  >
    <!-- mobile - some repetition of non-mobile here as it makes the conditionals less hard to understand -->
    <div class="md:hidden flex flex-wrap items-center gap-2 text-sm lg:text-base">
      <div class="flex group">
        <div class="flex items-center z-abovemap px-3 py-1 rounded-l bg-ons-census text-ons-grey-5 font-bold">
          <abbr title={geoTypePluralDescriptions[$viewport.geoType]} class="no-underline"
            >{$viewport.geoType.toUpperCase()}</abbr
          >
        </div>
        <div class={`z-abovemap px-3 py-1 rounded-r bg-ons-grey-75 text-ons-grey-5 `}>
          {geoTypePluralDescriptions[$viewport.geoType]}
        </div>
      </div>
    </div>

    <!-- non-mobile -->
    <div class="hidden md:flex flex-wrap items-center gap-1 text-sm lg:text-base">
      {#each geoTypes as g, i}
        {#if i !== 0}
          <div
            class="text-2xl text-ons-grey-100 select-none"
            class:hidden={i > geoTypes.indexOf($viewport.idealGeoType)}
          >
            <Icon kind="arrowRightAlt" />
          </div>
        {/if}
        <button
          class="flex group"
          on:click={() => commands.set({ kind: "zoom", geoType: g })}
          disabled={i >= geoTypes.indexOf($viewport.geoType)}
          class:opacity-80={i > geoTypes.indexOf($viewport.geoType)}
          class:hidden={i > geoTypes.indexOf($viewport.idealGeoType)}
        >
          <div
            title={geoTypePluralDescriptions[g]}
            class={`z-abovemap flex items-center  px-3 py-1 rounded-l bg-ons-census text-ons-grey-5 font-bold ${
              g === $viewport.geoType || g === $viewport.idealGeoType ? "" : "rounded-r"
            }`}
            class:bg-ons-grey-55={g !== $viewport.geoType}
            class:group-hover:bg-ons-census={i < geoTypes.indexOf($viewport.geoType)}
            class:bg-ons-census={g === $viewport.geoType}
          >
            <abbr title={geoTypePluralDescriptions[g]} class="no-underline">{g.toUpperCase()}</abbr>
          </div>
          <div
            class={`z-abovemap px-3 py-1 rounded-r bg-ons-grey-75 text-ons-grey-5 ${
              g === $viewport.geoType || g === $viewport.idealGeoType ? "block" : "hidden"
            } `}
            class:group-hover:bg-ons-grey-55={i < geoTypes.indexOf($viewport.geoType)}
          >
            {geoTypePluralDescriptions[g]}
            {#if i > geoTypes.indexOf($viewport.geoType)}
              <span>(unavailable)</span>
            {/if}
          </div>
        </button>
      {/each}
    </div>

    {#if $params?.embed?.areaSearch}
      <div class="min-w-[19rem] md:w-[25rem] lg:w-[30rem] justify-self-center">
        <AreaSearch embedded />
      </div>
    {/if}
  </div>
{/if}
