<script>
  import { page } from "$app/stores";
  import { vizStore, selectedGeographyStore, selectedGeographyVariableStore } from "../stores/stores";
  import topics from "../data/content";
  import { formatPercentage, formatTemplateString } from "../helpers/categoryHelpers";
  import { areAllDefined } from "../util/genUtil";
  import { choroplethColours } from "../helpers/choroplethHelpers";

  import BreaksChart from "./BreaksChart.svelte";

  $: variableData = $selectedGeographyVariableStore?.variableData;
  $: englandAndWalesVariableData = $selectedGeographyVariableStore?.englandAndWalesVariableData;
  $: params = $page.params;
  $: topicSlug = params.topic;
  $: topic = topics.find((t) => t.slug === topicSlug);
  $: variableSlug = params.variable;
  $: variable = topic ? topic.variables.find((v) => v.slug === variableSlug) : undefined;
  $: selectedGeographyDisplayName = $selectedGeographyStore?.displayName;
  $: categorySlug = params.category;
  $: category = variable ? variable.categories.find((c) => c.slug === categorySlug) : undefined;

  $: args = areAllDefined([topic, variableData, variable, category, selectedGeographyDisplayName]);
</script>

{#if category}
  <div class={`absolute bottom-8 left-1/2 -translate-x-1/2 `}>
    <div class="z-abovemap bg-white px-6 py-3 w-[40rem] h-[8.6rem]">
      <div class="">
        <div class="flex gap-3 mb-3">
          <div class="whitespace-nowrap">
            <span class="text-5xl font-bold">
              {$selectedGeographyVariableStore?.variableData[category.code].percentage.toFixed(1)}</span
            ><span class="text-4xl font-bold">%</span>
          </div>
          <div class="flex-grow">
            <div class="">
              {#if args}
                <span class="text-base leading-5">
                  {formatTemplateString(
                    variable,
                    variableData,
                    category,
                    selectedGeographyDisplayName,
                    category.category_h_pt2,
                  )}
                </span>
              {/if}
            </div>
            <div class="-mt-0.5">
              {#if args}
                <span class="text-lg font-bold">
                  {formatTemplateString(
                    variable,
                    variableData,
                    category,
                    selectedGeographyDisplayName,
                    category.category_h_pt3,
                  )}
                </span>
              {/if}
            </div>
          </div>
        </div>
        <BreaksChart
          selected={$selectedGeographyVariableStore?.variableData[category.code].percentage}
          suffix="%"
          breaks={$vizStore ? [$vizStore?.minMaxVals[0], ...$vizStore.breaks] : undefined}
          colors={choroplethColours}
        />
      </div>
    </div>
  </div>
{/if}
