<script lang="ts">
  // tempted to import stores/params here?
  // don't use the current params (input) to show the current results (output)
  // as that will make race conditions and incorrect vizualisations...
  // instead, use the params that were used to *request* the viz, i.e. `$viz.params`
  import { viz } from "../stores/viz";
  import { hovered } from "../stores/hovered";
  import { selected } from "../stores/selected";
  import { formatTemplateString } from "../helpers/categoryHelpers";
  import { roundedClassificationDataToString, getClassificationDataSuffix } from "../helpers/classificationHelpers";
  import { getDropdownDisplayType, getSign, shouldShowPositiveSign } from "../helpers/legendHelper";
  import { getColours } from "../helpers/choroplethHelpers";
  import BreaksChart from "./BreaksChart.svelte";
  import GeoTypeBadge from "./GeoTypeBadge.svelte";
  import CategorySelector from "./CategorySelector.svelte";
  import MapLegendExplanation from "./MapLegendExplanation.svelte";

  $: valueForHoveredGeography = $viz?.places.find((p) => p.geoCode === $hovered?.geoCode)?.categoryValues;
  $: suffix = $viz && getClassificationDataSuffix($viz.params.classification.code, $viz.params.mode);

  // the hovered, otherwise the selected, geography properties
  $: active = $hovered
    ? {
        geoType: $hovered.geoType,
        geoCode: $hovered.geoCode,
        displayName: $hovered.displayName,
        value: valueForHoveredGeography,
      }
    : {
        geoType: $selected?.geoType,
        geoCode: $selected?.geoCode,
        displayName: $selected?.displayName,
        value: $selected?.value,
      };

  const legendTextClass = "text-sm sm:text-base lg:text-lg xl:text-xl";
</script>

{#if $viz?.params?.category || active.geoCode}
  <div class={`absolute bottom-3 sm:bottom-5 lg:bottom-8 flex w-full justify-center`}>
    <div
      class="w-full max-w-[50rem] mx-3 lg:mx-4 bg-white bg-opacity-90 px-3 lg:px-5 py-2 lg:py-3 border-[1px] lg:border-[1px] border-ons-grey-15"
    >
      <div class="">
        {JSON.stringify(active.value)}
      </div>
      {#if $viz?.params?.category && active?.value !== undefined}
        <!-- full legend -->
        <div class="flex gap-3 items-center">Legend!</div>
      {:else}
        <!-- partial legend -->
        <div>
          {#if $viz?.params?.categories}
            <div>
              <span class={legendTextClass}>
                {#if $viz.params.mode === "change"}
                  Ten year change in
                {/if}
                {active.displayName}
              </span>
              <GeoTypeBadge geoType={active.geoType} />
            </div>
          {:else}
            <div class="text-center">
              <span class={legendTextClass}>
                {active.displayName}
              </span>
              <GeoTypeBadge geoType={active.geoType} />
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
{/if}
