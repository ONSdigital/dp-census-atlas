<script>
  import { fade } from "svelte/transition";
  import { page } from "$app/stores";
  import { selectedGeographyStore, mapStore, topicStore } from "../stores/stores";
  import tipStore from "../stores/tipStore";

  import Icon from "./MaterialIcon.svelte";
  import { geoTypeDescriptions } from "../helpers/geographyHelper";

  $: params = $page.params;
  $: topicSlug = params.topic;
  $: topic = $topicStore.find((t) => t.slug === topicSlug);
  $: variableSlug = params.variable;
  $: variable = topic ? topic.variables.find((v) => v.slug === variableSlug) : undefined;
  $: categorySlug = params.category;
  $: category = variable ? variable.categories.find((c) => c.slug === categorySlug) : undefined;
</script>

{#if $mapStore && $selectedGeographyStore && !category}
  <div class={`absolute top-[40%] left-1/2 -translate-x-1/2`}>
    <div class="z-abovemap px-3 py-1  rounded bg-ons-census text-ons-white">
      <div class="flex gap-2 items-center">
        <!-- <div class="text-xl">
          <Icon kind="west" />
        </div> -->
        <div>Select a topic to visualise</div>
      </div>
    </div>
  </div>
{/if}

{#if $mapStore}
  <div class={`absolute top-8 left-8 `}>
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
