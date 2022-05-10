<script lang="ts">
  import { _ } from "svelte-i18n";
  import { page } from "$app/stores";

  import { mapStore, vizStore, selectedGeographyStore, selectedGeographyVariableStore } from "../stores/stores";
  import topics from "../data/content";
  import { setVizStore } from "../data/setVizStore";
  import { setSelectedGeographyVariableStore } from "../data/setSelectedGeographyVariableStore";
  import { getCodesForCategory } from "../helpers/categoryHelpers";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  import { areAllDefined } from "../util/genUtil";

  import { formatPercentage, formatTemplateString } from "../helpers/categoryHelpers";
  import CensusTable from "./CensusTable.svelte";
  import NavigationComponent from "./NavigationComponent.svelte";
  import CategoryHeading from "./CategoryHeading.svelte";
  import CategoryLocationSummary from "./CategoryLocationSummary.svelte";
  import SearchHeader from "./SearchHeader.svelte";
  import Icon from "./Icon.svelte";
  import ONSShare from "./ons/ONSShare.svelte";
  import ONSShareItem from "./ons/ONSShareItem.svelte";
  import Explore from "./Explore.svelte";
  import BreaksChart from "./BreaksChart.svelte";
  import { choroplethColours } from "../helpers/choroplethHelpers";

  let changeLocation: boolean = false;

  $: variableData = $selectedGeographyVariableStore?.variableData;
  $: englandAndWalesVariableData = $selectedGeographyVariableStore?.englandAndWalesVariableData;
  $: params = $page.params;
  $: topicSlug = params.topic;
  $: topic = topics.find((t) => t.slug === topicSlug);
  $: variableSlug = params.variable;
  $: variable = topic.variables.find((v) => v.slug === variableSlug);
  $: search = $page.url.search;
  $: selectedGeographyDisplayName = $selectedGeographyStore?.displayName;
  $: selectedGeographyGeoCode = $selectedGeographyStore?.geoCode;
  $: categorySlug = params.category;
  $: category = variable.categories.find((c) => c.slug === categorySlug);

  $: if ($mapStore) {
    let codes = getCodesForCategory(params.topic, params.variable, params.classification, params.category);
    setVizStore({
      ...codes,
      geoType: $mapStore.geoType, // todo remove
      geoCode: selectedGeographyGeoCode,
      bbox: $mapStore.bbox,
    });
    setSelectedGeographyVariableStore({
      totalCode: codes.totalCode,
      categoryCodes: codes.categoryCodes,
      geoCode: selectedGeographyGeoCode,
    });
  }

  $: args = areAllDefined([variableData, variable, category, selectedGeographyDisplayName]);
</script>

<svelte:head>
  <title
    >{$_("categoryPage.html.title", {
      values: {
        categoryName: category.name,
        selectedGeographyDisplayName: `${selectedGeographyDisplayName}`,
      },
    })}</title
  >
</svelte:head>

<!-- 
<div class="">
  {$vizStore.breaks}
</div>
<div class="">
  {$vizStore?.minMaxVals[0]} /
  {$vizStore?.minMaxVals[1]}
</div>
 -->

<!-- <div class="p-4">
  <div class="flex gap-3">
    <div class="whitespace-nowrap">
      <span class="text-5xl font-bold">
        {$selectedGeographyVariableStore?.variableData[category.code].percentage.toFixed(1)}
      </span>
      <span class="text-4xl font-bold">%</span>
    </div>
    <div class="flex-grow">
      <div class="">
        {#if args}
          <span class="text-sm">
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
      <div class="">
        {#if args}
          <span class="text-base">
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
</div> -->

<br />

<!-- {#if changeLocation}
    <SearchHeader onClose={() => (changeLocation = !changeLocation)} />
  {:else}
    <CategoryHeading {variableData} {variable} {category} location={selectedGeographyDisplayName} />
    <NavigationComponent
      {search}
      {topicSlug}
      currentURL={$page.url.pathname}
      onClick={() => (changeLocation = !changeLocation)}
    />
  {/if} -->
<!-- <CategoryLocationSummary
      {variable}
      {variableData}
      {englandAndWalesVariableData}
      {category}
      location={selectedGeographyDisplayName}
    /> -->

<CensusTable {variable} {variableData} />
<!-- <div>
      <ONSShare title={$_("share.title")}>
        <ONSShareItem label="Facebook" type="facebook"><Icon type="facebook" /></ONSShareItem>
        <ONSShareItem label="Twitter" type="twitter"><Icon type="twitter" /></ONSShareItem>
        <ONSShareItem label="Linkedin" type="linkedin"><Icon type="linkedin" /></ONSShareItem>
        <ONSShareItem
          title={$_("categoryPage.html.title", {
            values: { categoryName: category.name, selectedGeographyDisplayName: `${selectedGeographyDisplayName}` },
          })}
          label="Email"
          type="email"><Icon type="email" /></ONSShareItem
        >
      </ONSShare>
    </div> -->
<!-- <Explore
  content={[
    {
      label: $_("explore.newCategoryLabel"),
      href: buildHyperlink($page.url, {
        topic: topicSlug,
      }),
    },

    {
      label: selectedGeographyDisplayName ? $_("explore.chooseLocationLabel") : $_("explore.newLocationLabel"),
      href: "",
      onClick: () => (changeLocation = !changeLocation),
    },
    {
      label: $_("explore.backToStartLabel"),
      href: buildHyperlink($page.url),
    },
  ]}
/> -->

<!-- </div> -->
<!-- </div> -->
