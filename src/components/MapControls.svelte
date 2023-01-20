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
            <!-- initialism button (eg `LAD`) -->
            <button
              class="flex custom-ring"
              on:click={() => commands.set({ kind: "zoom", geoType: g })}
              disabled={i >= geoTypes.indexOf($viewport.geoType)}
              class:opacity-60={i > geoTypes.indexOf($viewport.geoType)}
            >
              <div
                title={geoTypePluralDescriptions[g]}
                class={`flex items-center px-3 py-1 rounded-l text-ons-grey-5 font-bold ${
                  g === $viewport.geoType || g === $viewport.idealGeoType ? "" : "last:rounded-r"
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
              <!-- geotype name button, eg `Local Authority Districts` -->
              <button
                disabled={g !== $viewport.geoType}
                class={`px-3 py-0 last:rounded-r bg-ons-grey-75 custom-ring flex items-center flex-nowrap ${
                  i > geoTypes.indexOf($viewport.geoType) ? "text-ons-white opacity-60" : "text-ons-grey-5"
                } ${g === $viewport.geoType ? "group hover:bg-ons-grey-100 focus:bg-ons-grey-100" : ""}`}
                on:click={() => {
                  if ($params.geoLock) {
                    deselectGeoTypeLock($page.url.searchParams);
                  } else {
                    selectGeoTypeLock($page.url.searchParams, $viewport.geoType);
                  }
                }}
              >
                <div class="relative">
                  <div class="group-hover:invisible group-focus:invisible">
                    {geoTypePluralDescriptions[g]}
                  </div>
                  <div class="hidden group-hover:flex group-focus:flex items-center gap-1 absolute left-0 top-0 ">
                    {#if !$params.geoLock}
                      <div><Icon kind="lock" /></div>
                      <div>Lock</div>
                    {:else}
                      <div><Icon kind="lockOpen" /></div>
                      <div>Unlock</div>
                    {/if}
                  </div>
                </div>
              </button>
            {/if}
            {#if i > geoTypes.indexOf($viewport.geoType)}
              <div class="flex items-center px-2 bg-ons-grey-55 text-ons-white text-sm last:rounded-r ">
                <div class="">unavailable</div>
              </div>
            {/if}
            {#if g === $viewport.geoType && $params.geoLock}
              <div
                class="flex items-center p-1 last:rounded-r bg-ons-grey-100 text-ons-grey-15 text-lg custom-ring "
                title="The map is locked to the {g.toUpperCase()} geography layer. This will limit the minimum zoom."
              >
                <Icon kind="lock" />
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
