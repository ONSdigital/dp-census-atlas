<script>
  import { page } from "$app/stores";
  import { vizStore, selectedGeographyStore } from "../stores/stores";
  import { contentStore } from "../stores/stores";
  import { formatTemplateString } from "../helpers/categoryHelpers";
  import { choroplethColours } from "../helpers/choroplethHelpers";
  import { getDefaultChoroplethClassification } from "../helpers/variableHelpers";
  import { ratioToRoundedPercentageString } from "../helpers/ratioHelpers";

  import BreaksChart from "./BreaksChart.svelte";

  $: categoryValueForSelectedGeography = $vizStore?.places.find(
    (p) => p.geoCode === $selectedGeographyStore?.geoCode,
  )?.ratioToTotal;
  $: params = $page.params;
  $: variableGroupSlug = params.variableGroup;
  $: variableGroup = $contentStore.variableGroups.find((t) => t.slug === variableGroupSlug);
  $: variableSlug = params.variable;
  $: variable = variableGroup ? variableGroup.variables.find((v) => v.slug === variableSlug) : undefined;
  $: selectedGeographyDisplayName = $selectedGeographyStore?.displayName;
  $: defaultChoroplethClassification = getDefaultChoroplethClassification(variable);
  $: categorySlug = params.category;
  $: category = variable ? defaultChoroplethClassification.categories.find((c) => c.slug === categorySlug) : undefined;
  $: breaks = $vizStore ? [$vizStore?.minMaxVals[0], ...$vizStore.breaks] : undefined;
</script>

<!-- todo: new design for all four states -->
<!--                      | no geography selected  |  geography selected    -->
<!-- ---------------------------------------------------------------------- -->
<!-- no category selected | show no legend at all  | just show the geography name  -->
<!--    category selected | show EW legend, no %   | full legend, with percentage  -->

{#if category || $selectedGeographyStore?.geoType !== "ew"}
  <div class={`absolute bottom-3 lg:bottom-8 flex w-full px-3 justify-center`}>
    <div class="z-abovemap bg-white bg-opacity-90 px-3 py-2 lg:px-5 lg:py-3">
      <div class="flex gap-3 mb-3 items-center">
        <!-- big percantage -->
        {#if category && categoryValueForSelectedGeography}
          <div class="whitespace-nowrap">
            <span class="text-4xl lg:text-5xl font-bold">
              {ratioToRoundedPercentageString(categoryValueForSelectedGeography)}</span
            ><span class="text-3xl lg:text-4xl font-bold">%</span>
          </div>
        {/if}
        <div class="flex-grow">
          {#if category && categoryValueForSelectedGeography}
            <div class="">
              <span class="text-base lg:text-xl">
                {formatTemplateString(variable, category, selectedGeographyDisplayName, category.legend_str_1)}
              </span>
              <span class="text-sm bg-ons-census text-white font-bold px-1 rounded-sm mx-1 align-text-top">
                {$selectedGeographyStore?.geoType?.toUpperCase()}
              </span>
              <span class="text-base lg:text-xl">
                {formatTemplateString(variable, category, selectedGeographyDisplayName, category.legend_str_2)}
              </span>
            </div>
            <div class="text-base lg:text-xl font-bold -mt-0.5">
              {formatTemplateString(variable, category, selectedGeographyDisplayName, category.legend_str_3)}
            </div>
          {:else if category}
            <div class="text-xl">{selectedGeographyDisplayName}</div>
            <div class="text-lg font-bold">
              {category.name}
            </div>
          {:else if $selectedGeographyStore?.geoType !== "ew"}
            <div class="">{selectedGeographyDisplayName}</div>
          {/if}
        </div>
      </div>
      {#if category && $vizStore}
        <BreaksChart selected={categoryValueForSelectedGeography} suffix="%" {breaks} colors={choroplethColours} />
      {/if}
    </div>
  </div>
{/if}
