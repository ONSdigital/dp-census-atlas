<script>
  import { viz } from "../stores/viz";
  import { selection } from "../stores/selection";
  import { geography } from "../stores/geography";
  import { formatTemplateString } from "../helpers/categoryHelpers";
  import { choroplethColours } from "../helpers/choroplethHelpers";
  import { getCategoryDataSuffix, roundCategoryDataToString } from "../helpers/categoryHelpers";
  import BreaksChart from "./BreaksChart.svelte";
  import GeoTypeBadge from "./GeoTypeBadge.svelte";

  // todo: what's this?
  $: categoryValueForSelectedGeography = $viz?.places.find((p) => p.geoCode === $geography?.geoCode)?.ratioToTotal;
  $: breaks = $viz ? [$viz?.minMaxVals[0], ...$viz.breaks] : undefined;
</script>

<!--                      | no geography selected  |  geography selected    -->
<!-- ---------------------------------------------------------------------- -->
<!-- no category selected | show no legend at all  | just show the geography name  -->
<!--    category selected | show EW legend, no %   | full legend, with percentage  -->

{#if $selection.category || $geography?.geoType !== "ew"}
  <div class={`absolute bottom-3 lg:bottom-8 flex w-full justify-center`}>
    <div
      class="z-abovemap w-full max-w-[50rem] mx-3 lg:mx-4 bg-white bg-opacity-90 px-3 lg:px-5 py-2 lg:py-3 border-[1px] lg:border-[1px] border-ons-grey-15"
    >
      {#if $selection.category && categoryValueForSelectedGeography}
        <!-- full legend -->
        <div class="flex gap-3 items-center">
          <div class="whitespace-nowrap">
            <span class="text-4xl md:text-5xl font-bold">
              {roundCategoryDataToString($selection.category.code, categoryValueForSelectedGeography)}</span
            ><span class="text-3xl md:text-4xl font-bold">{getCategoryDataSuffix($selection.category.code)}</span>
          </div>
          <div class="flex-grow leading-[0px]">
            <div class="">
              <span class="text-xs sm:text-base md:text-xl">
                {formatTemplateString(
                  $selection.variable,
                  $selection.category,
                  $geography.displayName,
                  $selection.category.legend_str_1,
                )}
              </span>
              <GeoTypeBadge geoType={$geography?.geoType} />
              <span class="text-xs sm:text-base md:text-xl">
                {formatTemplateString(
                  $selection.variable,
                  $selection.category,
                  $geography.displayName,
                  $selection.category.legend_str_2,
                )}
              </span>
            </div>
            <div class="text-xs sm:text-base md:text-xl font-bold">
              {formatTemplateString(
                $selection.variable,
                $selection.category,
                $geography.displayName,
                $selection.category.legend_str_3,
              )}
            </div>
          </div>
        </div>
      {:else}
        <!-- partial legend -->
        <div class="">
          <div class="">
            <span class="text-xs sm:text-base md:text-xl">
              {$geography.displayName}
            </span>
            <GeoTypeBadge geoType={$geography?.geoType} />
          </div>
          {#if $selection.category}
            <div class="text-xs sm:text-base md:text-xl font-bold">
              {$selection.category.name}
            </div>
          {/if}
        </div>
      {/if}

      {#if $selection.category && $viz}
        <BreaksChart
          selected={categoryValueForSelectedGeography}
          suffix={getCategoryDataSuffix($selection.category.code)}
          {breaks}
          colors={choroplethColours}
          categoryCode={$selection.category.code}
        />
      {/if}
    </div>
  </div>
{/if}
