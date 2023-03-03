<script lang="ts">
  import { tooltip } from "../actions/tooltip";
  import Icon from "./MaterialIcon.svelte";
  import AreaSearch from "./AreaSearch.svelte";
  import { GeoTypes } from "../types";
  import { selectGeoTypeLock, deselectGeoTypeLock } from "../helpers/navigationHelper";
  import { geoTypePluralNames, geoTypeSingularDescriptions } from "../helpers/geographyHelper";
  import { params } from "../stores/params";
  import { viewport } from "../stores/viewport";
  import { commands } from "../stores/commands";
  import { page } from "$app/stores";
  import { topoJsonLayersToAdd } from "../map/initMapLayers";
  import { get } from "svelte/store";

  const geoTypes = GeoTypes.filter((g) => g !== "ew");
</script>

{#if $viewport && $params?.classification}
  <div
    class="absolute top-3 lg:top-5 xl:top-8 left-3 lg:left-5 xl:left-8 mr-16 lg:mr-20 gap-3 flex flex-col items-start justify-between flex-wrap"
  >
    <!-- no breadcrumb (mobile) -->
    <div class={`flex flex-wrap items-center gap-2 text-sm lg:text-base`} class:md:hidden={!$params.embed}>
      <div class="flex">
        <div class="flex items-center px-3 py-1 rounded-l bg-ons-census text-ons-grey-5 font-bold">
          <abbr title={geoTypePluralNames[$viewport.geoType]} class="no-underline"
            >{$viewport.geoType.toUpperCase()}</abbr
          >
        </div>
        <div class={`px-3 py-1 last:rounded-r bg-ons-grey-75 text-ons-grey-5 `}>
          {geoTypePluralNames[$viewport.geoType]}
        </div>
      </div>
    </div>

    <!-- full breadcrumb (non-mobile) -->
    <div class={`hidden flex-wrap items-stretch gap-y-1.5 text-sm lg:text-base`} class:md:flex={!$params.embed}>
      {#each $params?.classification?.available_geotypes as g, i}
        {#if i !== 0}
          <div class="flex items-center text-xl px-1 text-ons-grey-100 select-none bg-ons-grey-15 bg-opacity-70">
            <Icon kind="chevronRight" />
          </div>
        {/if}
        {#if g === $viewport.geoType}
          <div class="flex bg-ons-grey-15 bg-opacity-70 first:rounded-l last:rounded-r">
            <div
              class="flex custom-ring"
              use:tooltip={{ placement: "bottom" }}
              title={geoTypeSingularDescriptions[g]}
              class:opacity-60={i > geoTypes.indexOf($viewport.geoType)}
            >
              <div
                class={"flex items-center px-3 py-1 rounded-l text-ons-grey-5 font-bold bg-ons-census"}
                class:hover:bg-ons-census={i < geoTypes.indexOf($viewport.geoType)}
              >
                <abbr class="no-underline">{g.toUpperCase()}</abbr>
              </div>
            </div>
          </div>

          <!-- geotype name button, eg `Local Authority Districts` -->
          <button
            class={`px-3 py-0 last:rounded-r bg-ons-grey-75 custom-ring flex items-center flex-nowrap ${
              i > geoTypes.indexOf($viewport.geoType) ? "text-ons-white opacity-60" : "text-ons-grey-5"
            } ${g === $viewport.geoType ? "group hover:bg-ons-grey-100 focus-visible:bg-ons-grey-100" : ""}`}
            on:click={() => {
              viewport.set({ bbox: $viewport.bbox, geoType: g, idealGeoType: g });
              commands.set({ kind: "zoom", geoType: g });
            }}
          >
            <div class="relative">
              <div>
                {geoTypePluralNames[g]}
              </div>
            </div>
          </button>
        {:else}
          <div class="flex bg-ons-grey-15 bg-opacity-70 first:rounded-l last:rounded-r">
            <button
              class="flex custom-ring"
              use:tooltip={{ placement: "bottom" }}
              title={geoTypeSingularDescriptions[g]}
              on:click={() => {
                viewport.set({ bbox: $viewport.bbox, geoType: g, idealGeoType: g });
                commands.set({ kind: "zoom", geoType: g });
              }}
            >
              <div
                class="flex items-center px-3 py-1 rounded-l text-ons-grey-5 font-bold last:rounded-r bg-ons-grey-75 hover:bg-ons-census"
              >
                <abbr class="no-underline">{g.toUpperCase()}</abbr>
              </div>
            </button>
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
