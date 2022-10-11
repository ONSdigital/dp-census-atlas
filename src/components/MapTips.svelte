<script>
  import { fade } from "svelte/transition";
  import { page } from "$app/stores";
  import { selectedGeographyStore, mapStore, contentStore } from "../stores/stores";
  import tipStore from "../stores/tipStore";
  import { getDefaultChoroplethClassification } from "../helpers/variableHelpers";
  import Icon from "./MaterialIcon.svelte";
  import { geoTypeDescriptions } from "../helpers/geographyHelper";

  $: params = $page.params;
  $: variableGroupSlug = params.variableGroup;
  $: variableGroup = $contentStore.variableGroups.find((t) => t.slug === variableGroupSlug);
  $: variableSlug = params.variable;
  $: variable = variableGroup ? variableGroup.variables.find((v) => v.slug === variableSlug) : undefined;
  $: defaultChoroplethClassification = getDefaultChoroplethClassification(variable);
  $: categorySlug = params.category;
  $: category = variable ? defaultChoroplethClassification.categories.find((c) => c.slug === categorySlug) : undefined;
</script>

{#if $mapStore && $selectedGeographyStore && !category}
  <div class={`absolute top-[48%] left-1/2 -translate-x-1/2`}>
    <div class="z-abovemap px-3 py-1  rounded bg-ons-census text-ons-white">
      <div class="flex gap-2 items-center">
        <div class="text-2xl">
          <Icon kind="keyboardBackspace" />
        </div>
        <div>Select a topic to visualise</div>
      </div>
    </div>
  </div>
{/if}

{#if $mapStore}
  <div class={`absolute top-3 left-3 lg:top-8 lg:left-8 `}>
    <div class="flex gap-1">
      <div class="flex">
        <div class="z-abovemap px-3 py-1  rounded-l bg-ons-census text-ons-grey-5 font-bold">
          {$mapStore.geoType.toUpperCase()}
        </div>
        <div class="z-abovemap px-3 py-1  rounded-r bg-ons-grey-75 text-ons-grey-5">
          {geoTypeDescriptions[$mapStore.geoType]}
        </div>
      </div>
    </div>
  </div>
  <!-- {#if category && !$tipStore.seenZoomTip && $mapStore.geoType !== "oa"}
    <div class="absolute top-[30%] left-1/2 -translate-x-1/2" transition:fade>
      <div class="z-abovemap px-3 py-1  rounded bg-ons-grey-5 text-ons-black">You can zoom in for more detail</div>
    </div>
  {/if} -->
{/if}
