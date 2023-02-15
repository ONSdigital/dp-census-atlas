<script>
  // tempted to import stores/params here?
  // don't use the current params (input) to show the current results (output)
  // as that will make race conditions and incorrect vizualisations...
  // instead, use the params that were used to *request* the viz, i.e. `$viz.params`
  import { viz } from "../stores/viz";
  import { hovered } from "../stores/hovered";
  import { selected } from "../stores/selected";
  import { formatTemplateString } from "../helpers/categoryHelpers";
  import { roundedClassificationDataToString } from "../helpers/classificationHelpers";
  import { getDropdownDisplayType, getSign, getSuffix, shouldShowPositiveSign } from "../helpers/legendHelper";
  import { getColours } from "../helpers/choroplethHelpers";
  import BreaksChart from "./BreaksChart.svelte";
  import GeoTypeBadge from "./GeoTypeBadge.svelte";
  import CategorySelector from "./CategorySelector.svelte";

  $: valueForHoveredGeography = $viz?.places.find((p) => p.geoCode === $hovered?.geoCode)?.categoryValue;

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

<!--                      | no geography selected  |  geography selected    -->
<!-- ---------------------------------------------------------------------- -->
<!-- no category selected | show no legend at all  | just show the geography name  -->
<!--    category selected | show EW legend, no %   | full legend, with percentage  -->

{#if $viz?.params?.category || active.geoCode}
  <div class={`absolute bottom-3 sm:bottom-5 lg:bottom-8 flex w-full justify-center`}>
    <div
      class="w-full max-w-[50rem] mx-3 lg:mx-4 bg-white bg-opacity-90 px-3 lg:px-5 py-2 lg:py-3 border-[1px] lg:border-[1px] border-ons-grey-15"
    >
      <!-- <div class="">
        {JSON.stringify({ code: $selected?.geoCode, value: $selected?.value })}
      </div> -->
      {#if $viz?.params?.category && active?.value !== undefined}
        <!-- full legend -->
        <div class="flex gap-3 items-center">
          <div class="hidden xs:block whitespace-nowrap">
            <span class="xs:text-4xl sm:text-5xl font-bold">
              {getSign($viz.params.mode, active.value)}{roundedClassificationDataToString(
                $viz.params.classification.code,
                active.value,
              )}</span
            ><span class="xs:text-2xl sm:text-4xl font-bold"
              >{getSuffix($viz.params.mode, $viz.params.classification.code)}</span
            >
          </div>
          <div class="flex-grow md:leading-[0px]">
            <div class="mb-0.5 xs:mb-0 inline xs:block">
              <!-- smaller mobile main value -->
              <span class="xs:hidden font-bold text-2xl leading-6 sm:leading-normal mr-0.5">
                <span class="">
                  {getSign($viz.params.mode, active.value)}{roundedClassificationDataToString(
                    $viz.params.classification.code,
                    active.value,
                  )}</span
                ><span class="text-base">{getSuffix($viz.params.mode, $viz.params.classification.code)}</span>
              </span>
              {#if $viz.params.mode === "choropleth"}
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
              {:else if $viz.params.mode === "change"}
                <span class={legendTextClass}>ten year change in {active.displayName}</span>
                <GeoTypeBadge geoType={active.geoType} />
                <span class={legendTextClass}>&nbsp;</span>
              {/if}
            </div>
            {#if $viz?.params?.embed?.categorySelection}
              <CategorySelector selected={$viz.params.category.slug} use={getDropdownDisplayType($viz.params.mode)} />
            {:else if $viz.params.mode === "choropleth"}
              <div class={`${legendTextClass} font-bold inline xs:block`}>
                {formatTemplateString(
                  $viz.params.variable,
                  $viz.params.category,
                  active.displayName,
                  $viz.params.category.legend_str_3,
                )}
              </div>
            {:else if $viz.params.mode === "change"}
              <div class={`${legendTextClass} font-bold inline xs:block`}>
                {$viz.params.category.name}
              </div>
            {/if}
          </div>
        </div>
      {:else}
        <!-- partial legend -->
        <div>
          {#if $viz?.params?.category}
            <div>
              <span class={legendTextClass}>
                {#if $viz.params.mode === "change"}
                  Ten year change in
                {/if}
                {active.displayName}
              </span>
              <GeoTypeBadge geoType={active.geoType} />
            </div>
            {#if $viz?.params?.embed?.categorySelection}
              <CategorySelector selected={$viz.params.category.slug} use="name" />
            {:else}
              <div class={`${legendTextClass} font-bold`}>
                {$viz.params.category.name}
              </div>
            {/if}
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

      {#if $viz}
        <BreaksChart
          selected={$selected?.value}
          hovered={active.value}
          suffix={getSuffix($viz.params.mode, $viz.params.classification.code)}
          breaks={$viz.breaks}
          colors={getColours($viz.params.mode, $viz.breaks)}
          classificationCode={$viz.params.classification.code}
          showPositive={shouldShowPositiveSign($viz.params.mode)}
        />
      {/if}
      {#if $viz?.params?.mode === "change"}
        <div class="text-xs xs:text-sm pt-0.5 xs:pt-2.5">
          Change in percentage points (pp) between March 2011 and March 2021 census.
        </div>
      {/if}
    </div>
  </div>
{/if}
