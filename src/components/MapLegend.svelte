<script>
  import { page } from "$app/stores";
  import { vizStore, selectedGeographyStore } from "../stores/stores";
  import { topicStore } from "../stores/stores";
  import { formatTemplateString } from "../helpers/categoryHelpers";
  import { minDecimalPlacesToAntialias, ratioToPercentage } from "../util/numberUtil";
  import { choroplethColours } from "../helpers/choroplethHelpers";
  import { getDefaultChoroplethClassification } from "../helpers/variableHelpers";

  import BreaksChart from "./BreaksChart.svelte";

  $: categoryValueForSelectedGeography = $vizStore?.places.find(
    (p) => p.geoCode === $selectedGeographyStore?.geoCode,
  )?.ratioToTotal;
  $: params = $page.params;
  $: topicSlug = params.topic;
  $: topic = $topicStore.find((t) => t.slug === topicSlug);
  $: variableSlug = params.variable;
  $: variable = topic ? topic.variables.find((v) => v.slug === variableSlug) : undefined;
  $: selectedGeographyDisplayName = $selectedGeographyStore?.displayName;
  $: defaultChoroplethClassification = getDefaultChoroplethClassification(variable);
  $: categorySlug = params.category;
  $: category = variable ? defaultChoroplethClassification.categories.find((c) => c.slug === categorySlug) : undefined;
  $: breaks = $vizStore ? [$vizStore?.minMaxVals[0], ...$vizStore.breaks] : undefined
  $: decimalPlaces = breaks ? minDecimalPlacesToAntialias(breaks) : 0
</script>

<!-- todo: new design for all four states -->
<!--                      | no geography selected  |  geography selected    -->
<!-- ---------------------------------------------------------------------- -->
<!-- no category selected | show no legend at all  | just show the geography name  -->
<!--    category selected | show EW legend, no %   | full legend, with percentage  -->

{#if category || $selectedGeographyStore?.geoType !== "ew"}
  <div class={`absolute bottom-8 left-1/2 -translate-x-1/2 `}>
    <div class="z-abovemap bg-white px-6 py-3 w-[40rem] h-[8.6rem]">
      <div class="flex gap-3 mb-3">
        <!-- big percantage -->
        {#if category && categoryValueForSelectedGeography}
          <div class="whitespace-nowrap">
            <span class="text-5xl font-bold"> {ratioToPercentage(categoryValueForSelectedGeography, 1)}</span><span
              class="text-4xl font-bold">%</span
            >
          </div>
        {/if}
        <div class="flex-grow">
          {#if category && categoryValueForSelectedGeography}
            <div class="text-base leading-5">
              <span>
                {formatTemplateString(variable, category, selectedGeographyDisplayName, category.legend_str_1)}
                {formatTemplateString(variable, category, selectedGeographyDisplayName, category.legend_str_2)}
              </span>
            </div>
            <div class="-mt-0.5 text-lg font-bold">
              {formatTemplateString(variable, category, selectedGeographyDisplayName, category.legend_str_3)}
            </div>
          {:else if category}
            <div class="">{selectedGeographyDisplayName}</div>
            <div class="text-lg font-bold">
              {category.name}
            </div>
          {:else if $selectedGeographyStore?.geoType !== "ew"}
            <div class="">{selectedGeographyDisplayName}</div>
          {/if}
        </div>
      </div>
      {#if category && $vizStore}
        <BreaksChart
          selected={categoryValueForSelectedGeography}
          suffix="%"
          breaks={breaks}
          decimalPlaces = {decimalPlaces}
          colors={choroplethColours}
        />
      {/if}
    </div>
  </div>
{/if}
