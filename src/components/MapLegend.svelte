<script>
  import { page } from "$app/stores";
  import { vizStore, selectedGeographyStore } from "../stores/stores";
  import topics from "../data/content";
  import { formatTemplateString } from "../helpers/categoryHelpers";
  import { areAllDefined } from "../util/genUtil";
  import { ratioToPercentage } from "../util/numberUtil";
  import { choroplethColours } from "../helpers/choroplethHelpers";

  import BreaksChart from "./BreaksChart.svelte";

  $: categoryValueForSelectedGeography = $vizStore?.places.find((place) => place.geoCode === $selectedGeographyStore?.geoCode)?.ratioToTotal;
  $: params = $page.params;
  $: topicSlug = params.topic;
  $: topic = topics.find((t) => t.slug === topicSlug);
  $: variableSlug = params.variable;
  $: variable = topic ? topic.variables.find((v) => v.slug === variableSlug) : undefined;
  $: selectedGeographyDisplayName = $selectedGeographyStore?.displayName;
  $: categorySlug = params.category;
  $: category = variable ? variable.categories.find((c) => c.slug === categorySlug) : undefined;

  $: args = areAllDefined([topic, categoryValueForSelectedGeography, variable, category, selectedGeographyDisplayName]);
</script>

{#if category}
  <div class={`absolute bottom-8 left-1/2 -translate-x-1/2 `}>
    <div class="z-abovemap bg-white px-6 py-3 w-[40rem] h-[8.6rem]">
      <div class="">
        <div class="flex gap-3 mb-3">
          {#if args}
          <div class="whitespace-nowrap">
            <span class="text-5xl font-bold">
              { ratioToPercentage(categoryValueForSelectedGeography, 1) }</span
            ><span class="text-4xl font-bold">%</span>
          </div>
          {/if}
          <div class="flex-grow">
            {#if args}
            <div class="">
              <span class="text-base leading-5">
                {formatTemplateString(
                  variable,
                  category,
                  selectedGeographyDisplayName,
                  category.category_h_pt2,
                  )}
              </span>
            </div>
            <div class="-mt-0.5">
              <span class="text-lg font-bold">
                {formatTemplateString(
                  variable,
                  category,
                  selectedGeographyDisplayName,
                  category.category_h_pt3,
                )}
              </span>
            </div>
            {:else}
              <span class="text-lg font-bold">
                {category.name}
              </span>
            {/if}
          </div>
        </div>
        <BreaksChart
          selected={categoryValueForSelectedGeography}
          suffix="%"
          breaks={$vizStore ? [$vizStore?.minMaxVals[0], ...$vizStore.breaks] : undefined}
          colors={choroplethColours}
        />
      </div>
    </div>
  </div>
{/if}
