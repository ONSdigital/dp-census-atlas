<script>
  import { page } from "$app/stores";
  import { dataUpdateInProgressStore, vizStore, selectedGeographyStore } from "../stores/stores";
  import { contentStore } from "../stores/stores";
  import { formatTemplateString } from "../helpers/categoryHelpers";
  import { choroplethColours } from "../helpers/choroplethHelpers";
  import { getDefaultChoroplethClassification } from "../helpers/variableHelpers";
  import { ratioToRoundedPercentageString } from "../helpers/ratioHelpers"

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
  $: breaks = $vizStore ? [$vizStore?.minMaxVals[0], ...$vizStore.breaks] : undefined

  const legendStrings = {
    bigPercentage: "",
    first: "",
    second: "",
    third: "",
  }
  const updateLegendStrs = () => {
    if (category && categoryValueForSelectedGeography && !$dataUpdateInProgressStore) {
      legendStrings.bigPercentage = ratioToRoundedPercentageString(categoryValueForSelectedGeography)
      legendStrings.first = category.legend_str_1.replace(new RegExp('{location}', 'g'), selectedGeographyDisplayName)
      legendStrings.second = category.legend_str_2
      legendStrings.third = category.legend_str_3
    }
  }
  dataUpdateInProgressStore.subscribe( (val) => {
    if (!val) {
      updateLegendStrs()
    }
  })
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
              <span class="text-5xl font-bold"> {legendStrings.bigPercentage}</span><span
                class="text-4xl font-bold">%</span
              >
            </div>
          {/if}
          <div class="flex-grow">
            {#if category && categoryValueForSelectedGeography}
              <div class="text-base leading-5">
                <span>
                  {legendStrings.first}
                  {legendStrings.second}
                </span>
              </div>
              <div class="-mt-0.5 text-lg font-bold">
                {legendStrings.third}
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
            colors={choroplethColours}
          />
        {/if}
    </div>
  </div>
{/if}
