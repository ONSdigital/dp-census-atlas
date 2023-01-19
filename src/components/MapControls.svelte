<script lang="ts">
  import Icon from "./MaterialIcon.svelte";
  import AreaSearch from "./AreaSearch.svelte";
  import { GeoTypes } from "../types";
  import { geoTypePluralDescriptions } from "../helpers/geographyHelper";
  import { selectGeoTypeLock, deselectGeoTypeLock } from "../helpers/navigationHelper";
  import { params } from "../stores/params";
  import { viewport } from "../stores/viewport";
  import { commands } from "../stores/commands";
  import { page } from "$app/stores";

  const geoTypes = GeoTypes.filter((g) => g !== "ew");
</script>

{#if $viewport}
  <div
    class="absolute top-3 lg:top-5 xl:top-8 left-3 lg:left-5 xl:left-8 mr-16 lg:mr-20 gap-3 flex flex-col items-start justify-between flex-wrap"
  >
    <!-- no breadcrumb (mobile) -->
    <div class={`flex flex-wrap items-center gap-2 text-sm lg:text-base`} class:md:hidden={!$params.embed}>
      <div class="flex">
        <div class="flex items-center px-3 py-1 rounded-l bg-ons-census text-ons-grey-5 font-bold">
          <abbr title={geoTypePluralDescriptions[$viewport.geoType]} class="no-underline"
            >{$viewport.geoType.toUpperCase()}</abbr
          >
        </div>
        <div class={`px-3 py-1 last:rounded-r bg-ons-grey-75 text-ons-grey-5 `}>
          {geoTypePluralDescriptions[$viewport.geoType]}
        </div>
        {#if $params.geoLock && !$params.embed}
          <div class="flex items-center p-1 last:rounded-r bg-ons-grey-100 text-ons-grey-15 text-xl">
            <Icon kind="lock" />
          </div>
        {/if}
      </div>
    </div>

    <!-- full breadcrumb (non-mobile) -->
    <div class={`hidden flex-wrap items-stretch gap-y-1.5 text-sm lg:text-base`} class:md:flex={!$params.embed}>
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
                title={i > geoTypes.indexOf($viewport.geoType)
                  ? `${g.toUpperCase()}-level data is not available for the ${
                      $params.classification.slug
                    } classification`
                  : undefined}
              >
                {geoTypePluralDescriptions[g]}
                {#if i > geoTypes.indexOf($viewport.geoType)}
                  <span class="text-sm"> unavailable for {$params.classification.slug}</span>
                {/if}
              </div>
            {/if}
          </div>
        {/if}
      {/each}
      <button
        on:click={() => {
          if ($params.geoLock) {
            deselectGeoTypeLock($page.url.searchParams);
          } else {
            selectGeoTypeLock($page.url.searchParams, $viewport.geoType);
          }
        }}
        title="Lock geotype"
        aria-label="Lock geotype"
        class="flex items-center ml-1 text-2xl hover:scale-105 custom-ring bg-ons-white hover:bg-ons-grey-35 border border-gray-300 rounded"
      >
        <Icon kind={$params.geoLock ? "lock" : "lockOpen"} />
      </button>
    </div>

    {#if $params?.embed?.areaSearch}
      <div class="min-w-[19rem] md:w-[25rem] lg:w-[30rem] justify-self-center">
        <AreaSearch embedded />
      </div>
    {/if}
  </div>
{/if}
