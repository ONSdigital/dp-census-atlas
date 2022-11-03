<script lang="ts">
  import Icon from "./MaterialIcon.svelte";
  import { type GeoType, GeoTypes } from "../types";
  import { geoTypeDescriptions } from "../helpers/geographyHelper";
  import { params } from "../stores/params";
  import { viewport, type Viewport } from "../stores/viewport";

  $: geoTypesToShow = [...getGeoTypesToShow($viewport)];

  function* getGeoTypesToShow($viewport: Viewport): Generator<GeoType> {
    if ($viewport) {
      console.log("foo");
      for (const g of GeoTypes.filter((g) => g !== "ew")) {
        yield g;
        if (g === $viewport.geoType) {
          break;
        }
      }
    }
  }
</script>

{#if !$params.category}
  <div class="absolute top-[48%] left-1/2 -translate-x-1/2">
    <div class="z-abovemap px-3 py-1  rounded bg-ons-census-supporting text-ons-white">
      <div class="flex gap-2 items-center">
        <div class="hidden lg:block text-2xl">
          <Icon kind="keyboardBackspace" />
        </div>
        <div>Select a topic to visualise</div>
      </div>
    </div>
  </div>
{/if}

{#if $viewport}
  <div class="absolute top-3 lg:top-5 xl:top-8 left-3 lg:left-5 xl:left-8 right-16 lg:right-20">
    <div class="flex flex-wrap items-center gap-2 text-sm lg:text-base">
      <!-- <div class="flex">
        <div class="z-abovemap px-3 py-1 rounded-l bg-ons-census text-ons-grey-5 font-bold">
          {$viewport.geoType.toUpperCase()}
        </div>
        <div class="z-abovemap px-3 py-1 rounded-r bg-ons-grey-75 text-ons-grey-5">
          {geoTypeDescriptions[$viewport.geoType]}
        </div>
      </div> -->
      {#each geoTypesToShow as geoType, i}
        {#if true}
          {#if i !== 0}
            <div class="text-xl text-ons-grey-100 select-none">▸</div>
          {/if}
          <div class="flex" class:opacity-80={geoType !== $viewport.geoType}>
            <div
              class="z-abovemap px-3 py-1 rounded-l bg-ons-census text-ons-grey-5 font-bold"
              class:bg-ons-grey-55={geoType !== $viewport.geoType}
              class:bg-ons-census={geoType === $viewport.geoType}
            >
              {geoType.toUpperCase()}
            </div>
            <div class="z-abovemap px-3 py-1 rounded-r bg-ons-grey-75 text-ons-grey-5">
              {geoTypeDescriptions[geoType]}
            </div>
          </div>
        {/if}
      {/each}
    </div>
  </div>
{/if}
