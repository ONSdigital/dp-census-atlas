<script>
  import { page } from "$app/stores";
  import { vizStore, selectedGeographyStore } from "../stores/stores";
  import { contentStore } from "../stores/stores";
  import { formatTemplateString } from "../helpers/categoryHelpers";
  import { choroplethColours } from "../helpers/choroplethHelpers";
  import { dataToRoundedString } from "../helpers/percentageHelpers";

  import BreaksChart from "./BreaksChart.svelte";
  import GeoTypeBadge from "./GeoTypeBadge.svelte";

  $: categoryValueForSelectedGeography = $vizStore?.places.find(
    (p) => p.geoCode === $selectedGeographyStore?.geoCode,
  )?.ratioToTotal;
  $: params = $page.params;
  $: variableGroupSlug = params.variableGroup;
  $: variableGroup = $contentStore.variableGroups.find((t) => t.slug === variableGroupSlug);
  $: variableSlug = params.variable;
  $: variable = variableGroup ? variableGroup.variables.find((v) => v.slug === variableSlug) : undefined;
  $: classificationSlug = params?.classification;
  $: classification = variable?.classifications.find((c) => c.slug === classificationSlug);
  $: selectedGeographyDisplayName = $selectedGeographyStore?.displayName;
  $: categorySlug = params.category;
  $: category = variable ? classification?.categories.find((c) => c.slug === categorySlug) : undefined;
  $: breaks = $vizStore ? [$vizStore?.minMaxVals[0], ...$vizStore.breaks] : undefined;
</script>

<!-- todo: new design for all four states -->
<!--                      | no geography selected  |  geography selected    -->
<!-- ---------------------------------------------------------------------- -->
<!-- no category selected | show no legend at all  | just show the geography name  -->
<!--    category selected | show EW legend, no %   | full legend, with percentage  -->

{#if category || $selectedGeographyStore?.geoType !== "ew"}
  <div class={`absolute bottom-3 lg:bottom-8 flex w-full justify-center`}>
    <div
      class="z-abovemap w-full max-w-[50rem] mx-3 lg:mx-4 bg-white bg-opacity-90 px-3 lg:px-5 py-2 lg:py-3 border-[1px] lg:border-[1px] border-ons-grey-15"
    >
      {#if category && categoryValueForSelectedGeography}
        <!-- full legend -->
        <div class="flex gap-3 items-center">
          <div class="whitespace-nowrap">
            <span class="text-4xl md:text-5xl font-bold">
              {dataToRoundedString(categoryValueForSelectedGeography)}</span
            ><span class="text-3xl md:text-4xl font-bold">%</span>
          </div>
          <div class="flex-grow leading-[0px]">
            <div class="">
              <span class="text-xs sm:text-base md:text-xl">
                {formatTemplateString(variable, category, selectedGeographyDisplayName, category.legend_str_1)}
              </span>
              <GeoTypeBadge geoType={$selectedGeographyStore?.geoType} />
              <span class="text-xs sm:text-base md:text-xl">
                {formatTemplateString(variable, category, selectedGeographyDisplayName, category.legend_str_2)}
              </span>
            </div>
            <div class="text-xs sm:text-base md:text-xl font-bold">
              {formatTemplateString(variable, category, selectedGeographyDisplayName, category.legend_str_3)}
            </div>
          </div>
        </div>
      {:else}
        <!-- partial legend -->
        <div class="">
          <div class="">
            <span class="text-xs sm:text-base md:text-xl">
              {selectedGeographyDisplayName}
            </span>
            <GeoTypeBadge geoType={$selectedGeographyStore?.geoType} />
          </div>
          {#if category}
            <div class="text-xs sm:text-base md:text-xl font-bold">
              {category.name}
            </div>
          {/if}
        </div>
      {/if}

      {#if category && $vizStore}
        <BreaksChart selected={categoryValueForSelectedGeography} suffix="%" {breaks} colors={choroplethColours} />
      {/if}
    </div>
  </div>
{/if}
