<script>
  import { viz } from "../stores/viz";
  import { geography } from "../stores/geography";
  import { hovered } from "../stores/hovered";
  import { selected } from "../stores/selected";
  import { formatTemplateString } from "../helpers/categoryHelpers";
  import { choroplethColours } from "../helpers/choroplethHelpers";
  import { getVariableDataSuffix } from "../helpers/contentHelpers";
  import { dataToRoundedString } from "../helpers/percentageHelpers";
  import BreaksChart from "./BreaksChart.svelte";
  import GeoTypeBadge from "./GeoTypeBadge.svelte";

  // $: valueForSelectedGeography = $viz?.places.find((p) => p.geoCode === $geography?.geoCode)?.ratioToTotal;
  $: valueForHoveredGeography = $viz?.places.find((p) => p.geoCode === $hovered?.geoCode)?.ratioToTotal;
  $: breaks = $viz ? [$viz?.minMaxVals[0], ...$viz.breaks] : undefined;

  // use the hovered geo, otherwise the selected
  $: active = valueForHoveredGeography
    ? {
        geoType: $hovered?.geoType,
        geoCode: $hovered?.geoCode,
        displayName: $hovered?.displayName,
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

<!--                      | no geography selected  |  geography selected    -->
<!-- ---------------------------------------------------------------------- -->
<!-- no category selected | show no legend at all  | just show the geography name  -->
<!--    category selected | show EW legend, no %   | full legend, with percentage  -->

{#if $viz?.params?.category}
  <div class={`absolute bottom-3 lg:bottom-8 flex w-full justify-center`}>
    <div
      class="z-abovemap w-full max-w-[50rem] mx-3 lg:mx-4 bg-white bg-opacity-90 px-3 lg:px-5 py-2 lg:py-3 border-[1px] lg:border-[1px] border-ons-grey-15"
    >
      <div class="">
        {JSON.stringify($selected?.value)}
      </div>
      {#if $viz?.params?.category && ($selected?.value || valueForHoveredGeography)}
        <!-- full legend -->
        <div class="flex gap-3 items-center">
          <div class="whitespace-nowrap">
            <span class="text-4xl md:text-5xl font-bold"> {dataToRoundedString(active.value)}</span><span
              class="text-3xl md:text-4xl font-bold">{getVariableDataSuffix($viz.params.variable)}</span
            >
          </div>
          <div class="flex-grow leading-[0px]">
            <div class="">
              <span class={legendTextClass}>
                {formatTemplateString(
                  $viz.params.variable,
                  $viz.params.category,
                  active.displayName,
                  $viz.params.category.legend_str_1,
                )}
              </span>
              <GeoTypeBadge geoType={active.geoType} />
              <span class={legendTextClass}>
                {formatTemplateString(
                  $viz.params.variable,
                  $viz.params.category,
                  active.displayName,
                  $viz.params.category.legend_str_2,
                )}
              </span>
            </div>
            <div class={`${legendTextClass} font-bold`}>
              {formatTemplateString(
                $viz.params.variable,
                $viz.params.category,
                active.displayName,
                $viz.params.category.legend_str_3,
              )}
            </div>
          </div>
        </div>
      {:else}
        <!-- partial legend -->
        <div class="">
          <div class="">
            <span class={legendTextClass}>
              {active.displayName}
            </span>
            <GeoTypeBadge geoType={active.geoType} />
          </div>
          {#if $viz?.params?.category}
            <div class={`${legendTextClass} font-bold`}>
              {$viz.params.category.name}
            </div>
          {/if}
        </div>
      {/if}

      {#if $viz?.params?.category && $viz?.breaks}
        <BreaksChart
          selected={active.value}
          suffix={getVariableDataSuffix($viz.params.variable)}
          {breaks}
          colors={choroplethColours}
        />
      {/if}
    </div>
  </div>
{/if}
