<script lang="ts">
  import { slide, fade } from "svelte/transition";
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
    class="absolute top-3 lg:top-5 xl:top-8 left-3 lg:left-5 xl:left-8 mr-16 lg:mr-20 gap-3 flex items-start justify-between flex-wrap"
  >
    <!-- mobile - some repetition of non-mobile here as it makes the conditionals less hard to understand -->
    <div class="md:hidden flex flex-wrap items-center gap-2 text-sm lg:text-base">
      <div class="flex">
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
    <div class="z-abovemap hidden md:flex flex-wrap items-stretch gap-y-1.5 text-sm lg:text-base">
      {#each geoTypes as g, i}
        {#if i <= geoTypes.indexOf($viewport.idealGeoType)}
          {#if i !== 0}
            <div class="flex items-center text-xl px-1 text-ons-grey-100 select-none bg-ons-grey-15 bg-opacity-70">
              <Icon kind="chevronRight" />
            </div>
          {/if}
          <div class="flex bg-ons-grey-15 bg-opacity-70 first:rounded-l last:rounded-r">
            <button
              class="flex"
              on:click={() => commands.set({ kind: "zoom", geoType: g })}
              disabled={i >= geoTypes.indexOf($viewport.geoType)}
              class:opacity-60={i > geoTypes.indexOf($viewport.geoType)}
            >
              <div
                title={geoTypePluralDescriptions[g]}
                class={`flex items-center px-3 py-1 rounded-l text-ons-grey-5 font-bold ${
                  g === $viewport.geoType || g === $viewport.idealGeoType ? "" : "rounded-r"
                } ${
                  i < geoTypes.indexOf($viewport.geoType)
                    ? "bg-ons-grey-75"
                    : g === $viewport.geoType
                    ? "bg-ons-census"
                    : "bg-ons-grey-35"
                } `}
                class:hover:bg-ons-census={i < geoTypes.indexOf($viewport.geoType)}
              >
                <abbr title={geoTypePluralDescriptions[g]} class="no-underline">{g.toUpperCase()}</abbr>
              </div>
            </button>
            {#if g === $viewport.geoType || g === $viewport.idealGeoType}
              <div
                class={`px-3 py-1 rounded-r bg-ons-grey-75  ${
                  i > geoTypes.indexOf($viewport.geoType) ? " text-ons-white opacity-60" : "text-ons-grey-5"
                }`}
              >
                {geoTypePluralDescriptions[g]}
                {#if i > geoTypes.indexOf($viewport.geoType)}
                  <span>(unavailable)</span>
                {/if}
              </div>
            {/if}
          </div>
        {/if}
      {/each}
    </div>

    {#if $params?.embed?.areaSearch}
      <div class="min-w-[19rem] md:w-[25rem] lg:w-[30rem] justify-self-center">
        <AreaSearch embedded />
      </div>
    {/if}
  </div>
{/if}
