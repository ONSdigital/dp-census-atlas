<script lang="ts">
  // tempted to import stores/params here?
  // don't use the current params (input) to show the current results (output)
  // as that will make race conditions and incorrect vizualisations...
  // instead, use the params that were used to *request* the viz, i.e. `$viz.params`
  import { viz } from "../stores/viz";
  import { viewport } from "../stores/viewport";
  import { hovered } from "../stores/hovered";
  import { selected } from "../stores/selected";
  import { tooltip } from "../actions/tooltip";
  import GeoTypeBadge from "./GeoTypeBadge.svelte";
  import MultiCategoryMapLegendToggle from "./MultiCategoryMapLegendToggle.svelte";
  import { dotdensityColours, getDensityForZoomLevel, makeUnitSingular } from "../helpers/dotdensityHelpers";

  $: open = true;
  const toggleOpen = () => {
    open = !open;
  };

  const getColourForCategory = (categoryCode: string) => {
    return $viz.params.classification.categories
      .map((c, i) => ({ code: c.code, colour: dotdensityColours[i] }))
      .find((c) => c.code === categoryCode).colour;
  };

  const shouldBeHorizontal = () => $viz.params.categories.filter((c) => c.name.length > 30).length < 3;
  const shouldBeCollapsable = () => $viz.params.categories.length > 2;

  $: valueForHoveredGeography = $viz?.places.find((p) => p.geoCode === $hovered?.geoCode)?.categoryValues;

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
        value:
          $selected && "values" in $selected
            ? $selected?.values
            : $viz && "englandAndWales" in $viz
            ? Object.entries($viz.englandAndWales).map(([code, value]) => ({ code, value }))
            : undefined,
      };

  const legendTextClass = "text-sm sm:text-base lg:text-lg xl:text-xl";
</script>

{#if $viz?.params?.categories || active.geoCode}
  <div class={`absolute bottom-3 sm:bottom-5 lg:bottom-6 flex w-full justify-center`}>
    <div
      class="w-full max-w-[50rem] mx-3 lg:mx-4 bg-white bg-opacity-90 px-3 lg:px-5 py-2 lg:py-3 border-[1px] lg:border-[1px] border-ons-grey-15"
    >
      {#if $viz?.params?.categories && active?.value !== undefined}
        <!-- full legend -->
        <div class="flex flex-col gap-2 sm:gap-4" class:sm:flex-row={shouldBeHorizontal()}>
          <div class="flex flex-col flex-1">
            <div class="flex gap-2 items-start justify-between">
              <div>
                <div class={`${legendTextClass} break-keep`}>
                  <span class="font-bold">{$viz.params.variable.name}</span> in
                </div>
                <span class={legendTextClass}>
                  {active.displayName}
                </span>
                <GeoTypeBadge geoType={active.geoType} />
              </div>
              <div class="block" class:sm:hidden={shouldBeHorizontal() && open}>
                <MultiCategoryMapLegendToggle {open} {toggleOpen} />
              </div>
            </div>
            <div class="grow" />
            {#if shouldBeHorizontal()}
              <div class="text-sm mt-3">
                One dot represents {getDensityForZoomLevel($viewport.zoom).toLocaleString()}
                {makeUnitSingular($viz.params.variable.units, $viewport.zoom)}
              </div>
            {/if}
          </div>
          {#if open && $viz.params.categories.length > 0}
            <div class="flex flex-1 flex-col gap-1">
              {#each $viz.params.categories as category, i}
                {@const value = active.value.find((v) => v.code === category.code).value}
                {@const ewValue = $viz.englandAndWales[category.code]}
                <div class="">
                  <div class="flex gap-2 items-start sm:items-end justify-between">
                    <div class="leading-[1.35rem]" class:widows={"3"}>
                      {category.name}&nbsp;<span class="ml-0.5 font-bold">
                        {value}%
                      </span>
                    </div>
                    {#if i === 0 && open && shouldBeCollapsable()}
                      {#if shouldBeHorizontal()}
                        <div class="hidden sm:block">
                          <MultiCategoryMapLegendToggle {open} {toggleOpen} />
                        </div>
                      {/if}
                    {/if}
                  </div>
                  <div class="relative h-4">
                    <div
                      class="h-4 absolute left-0 top-0"
                      style:background-color={getColourForCategory(category.code)}
                      style:width={`${value}%`}
                    />
                    <div
                      class="h-4 w-1 absolute left-0 top-0 bg-ons-black"
                      style:left={`${Math.max(ewValue - 0.1, 0)}%`}
                      use:tooltip={{ content: `${ewValue}% for England & Wales`, placement: "bottom" }}
                    />
                  </div>
                </div>
              {/each}
              <div class="flex gap-x-2 mt-2 justify-between">
                <div class="text-sm flex items-center gap-2">
                  <div class="h-4 w-1 bg-ons-black inline-block" />
                  England and Wales average
                  <!-- <button class="hyperlink-subdued text-sm">Show values</button> -->
                </div>
                {#if !shouldBeHorizontal()}
                  <div class="text-sm">
                    One dot represents {getDensityForZoomLevel($viewport.zoom).toLocaleString("en")}
                    {makeUnitSingular($viz.params.variable.units, $viewport.zoom)}
                  </div>
                {/if}
              </div>
            </div>
          {/if}
        </div>
      {:else}
        <!-- partial legend -->
        <div>
          {#if $viz?.params?.categories}
            <div>
              <span class={legendTextClass}>
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
