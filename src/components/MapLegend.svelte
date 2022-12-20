<script>
  import { viz } from "../stores/viz";
  import { hovered } from "../stores/hovered";
  import { selected } from "../stores/selected";
  import { formatTemplateString } from "../helpers/categoryHelpers";
  import { colours, getColoursForBreaks } from "../helpers/choroplethHelpers";
  import { getClassificationDataSuffix, roundedClassificationDataToString } from "../helpers/classificationHelpers";
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
  $: colors = $viz ? getColoursForBreaks($viz.breaks, $viz.params.changeOverTime) : colours.standard;
</script>

<!--                      | no geography selected  |  geography selected    -->
<!-- ---------------------------------------------------------------------- -->
<!-- no category selected | show no legend at all  | just show the geography name  -->
<!--    category selected | show EW legend, no %   | full legend, with percentage  -->

{#if $viz?.params?.category || active.geoCode}
  <div class={`absolute bottom-3 sm:bottom-5 lg:bottom-8 flex w-full justify-center`}>
    <div
      class="z-abovemap w-full max-w-[50rem] mx-3 lg:mx-4 bg-white bg-opacity-90 px-3 lg:px-5 py-2 lg:py-3 border-[1px] lg:border-[1px] border-ons-grey-15"
    >
      <!-- <div class="">
        {JSON.stringify({ code: $selected?.geoCode, value: $selected?.value })}
      </div> -->
      {#if $viz?.params?.category && active?.value !== undefined}
        <!-- full legend -->
        <div class="flex gap-3 items-center">
          <div class="hidden xs:block whitespace-nowrap">
            <span class="xs:text-4xl sm:text-5xl font-bold">
              {roundedClassificationDataToString($viz.params.classification.code, active.value)}</span
            >
            {#if $viz.params.changeOverTime}
              <span class="xs:text-2xl sm:text-4xl font-bold">pp</span>
            {:else}
              <span class="xs:text-2xl sm:text-4xl font-bold"
                >{getClassificationDataSuffix($viz.params.classification.code)}</span
              >
            {/if}
          </div>
          <div class="flex-grow leading-[0px]">
            <div class="">
              <span class="xs:hidden font-bold">
                <span class="">
                  {roundedClassificationDataToString($viz.params.classification.code, active.value)}</span
                >
                {#if $viz.params.changeOverTime}
                  <span class="text-sm">pp</span>
                {:else}
                  <span class="text-sm">{getClassificationDataSuffix($viz.params.classification.code)}</span>
                {/if}
              </span>
              <span class={legendTextClass}>
                {#if $viz.params.changeOverTime}
                  {$viz.params.variable.units} in {active.displayName}
                {:else}
                  {formatTemplateString(
                    $viz.params.variable,
                    $viz.params.category,
                    active.displayName,
                    $viz.params.category.legend_str_1,
                  )}
                {/if}
              </span>
              <GeoTypeBadge geoType={active.geoType} />
              {#if !$viz.params.changeOverTime}
                <span class={legendTextClass}>
                  {formatTemplateString(
                    $viz.params.variable,
                    $viz.params.category,
                    active.displayName,
                    $viz.params.category.legend_str_2,
                  )}
                </span>
              {/if}
            </div>
            {#if $viz.params.changeOverTime}
              {#if $viz?.params?.embed?.categorySelection}
                <CategorySelector selected={$viz.params.category.slug} use="name" />
              {:else}
                <div class={`${legendTextClass} font-bold`}>
                  {$viz.params.category.name}
                </div>
              {/if}
            {:else if $viz?.params?.embed?.categorySelection}
              <CategorySelector selected={$viz.params.category.slug} use="legendString" />
            {:else}
              <div class={`${legendTextClass} font-bold`}>
                {formatTemplateString(
                  $viz.params.variable,
                  $viz.params.category,
                  active.displayName,
                  $viz.params.category.legend_str_3,
                )}
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
          suffix={getClassificationDataSuffix($viz.params.classification.code)}
          breaks={$viz.breaks}
          {colors}
          classificationCode={$viz.params.classification.code}
        />
      {/if}
    </div>
  </div>
{/if}
