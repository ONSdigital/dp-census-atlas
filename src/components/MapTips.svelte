<script lang="ts">
  import Icon from "./MaterialIcon.svelte";
  import { GeoTypes } from "../types";
  import { geoTypeDescriptions } from "../helpers/geographyHelper";
  import { params } from "../stores/params";
  import { viewport, type Viewport } from "../stores/viewport";

  const geoTypes = GeoTypes.filter((g) => g !== "ew");
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
      {#each geoTypes as g, i}
        {#if i !== 0}
          <div
            class="text-xl text-ons-grey-100 select-none"
            class:hidden={i > geoTypes.indexOf($viewport.idealGeoType)}
          >
            <Icon kind="arrowRightAlt" />
          </div>
        {/if}
        <div
          class="flex"
          class:opacity-70={i > geoTypes.indexOf($viewport.geoType)}
          class:hidden={i > geoTypes.indexOf($viewport.idealGeoType)}
        >
          <div
            class="z-abovemap px-3 py-1 rounded-l bg-ons-census text-ons-grey-5 font-bold"
            class:bg-ons-grey-55={g !== $viewport.geoType}
            class:bg-ons-census={g === $viewport.geoType}
          >
            {g.toUpperCase()}
          </div>
          <div class="z-abovemap px-3 py-1 rounded-r bg-ons-grey-75 text-ons-grey-5">
            {geoTypeDescriptions[g]}
            {#if i > geoTypes.indexOf($viewport.geoType)}
              <span class="">not available</span>
              <!-- for {$params?.classification?.code} -->
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}
