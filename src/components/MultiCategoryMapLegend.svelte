<script lang="ts">
  // tempted to import stores/params here?
  // don't use the current params (input) to show the current results (output)
  // as that will make race conditions and incorrect vizualisations...
  // instead, use the params that were used to *request* the viz, i.e. `$viz.params`
  import { viz } from "../stores/viz";
  import { hovered } from "../stores/hovered";
  import { selected } from "../stores/selected";
  import { tooltip } from "../actions/tooltip";
  import { roundedClassificationDataToString, getClassificationDataSuffix } from "../helpers/classificationHelpers";
  import GeoTypeBadge from "./GeoTypeBadge.svelte";

  let colours = ["#3bb2d0", "#e55e5e", "#223b53", "#fbb03b", "#ccc"];

  const getColourForCategory = (categoryCode: string) => {
    return $viz.params.categories
      .map((c, i) => ({ code: c.code, colour: colours[i] }))
      .find((c) => c.code === categoryCode).colour;
  };

  const shouldBeHorizontal = () => $viz.params.categories.filter((c) => c.name.length > 25).length < 2;

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
        value: $selected && "values" in $selected ? $selected?.values : undefined,
      };

  const legendTextClass = "text-sm sm:text-base lg:text-lg xl:text-xl";
</script>

{#if $viz?.params?.categories || active.geoCode}
  <div class={`absolute bottom-3 sm:bottom-5 lg:bottom-8 flex w-full justify-center`}>
    <div
      class="w-full max-w-[50rem] mx-3 lg:mx-4 bg-white bg-opacity-90 px-3 lg:px-5 py-2 lg:py-3 border-[1px] lg:border-[1px] border-ons-grey-15"
    >
      {#if $viz?.params?.categories && active?.value !== undefined}
        <!-- full legend -->
        <div class="flex flex-col gap-2 sm:gap-4" class:sm:flex-row={shouldBeHorizontal()}>
          <div class="flex flex-1 flex-col">
            <div class="">
              <div class={`${legendTextClass} break-keep`}>
                <span class="font-bold">{$viz.params.variable.name}</span> in
              </div>
              <span class={legendTextClass}>
                {active.displayName}
              </span>
              <GeoTypeBadge geoType={active.geoType} />
            </div>
            <div class="grow" />
            <div class="text-sm">One dot represents 500 households</div>
          </div>
          <div class="flex flex-1 flex-col gap-2">
            {#each $viz.params.categories as category}
              {@const value = active.value.find((v) => v.code === category.code).value}
              {@const ewValue = $viz.englandAndWales[category.code]}
              <div class=" ">
                <div class="leading-[1.35rem] mb-0.5" class:widows={"3"}>
                  {category.name}&nbsp;<span class="ml-0.5 font-bold">
                    {value}%
                  </span>
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
            <div class="text-sm flex items-center gap-2 mt-4">
              <div class="h-4 w-1 bg-ons-black inline-block" />
              England and Wales average
              <!-- <button class="hyperlink-subdued text-sm">Show values</button> -->
            </div>
          </div>
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
