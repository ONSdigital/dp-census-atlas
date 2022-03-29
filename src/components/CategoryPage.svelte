<script lang="ts">
  import { page } from "$app/stores";
  import { mapStore, selectedGeographyStore, vizStore } from "../stores/stores";
  import { setVizStore } from "../data/setVizStore";
  import { getCodesForCategory } from "../helpers/categoryHelpers";
  import CensusTable from "./CensusTable.svelte";
  import NavigationComponent from "./NavigationComponent.svelte";
  import topics from "../data/content";
  import CategoryHeading from "./CategoryHeading.svelte";
  import CategoryLocationSummary from "./CategoryLocationSummary.svelte";
  import SearchHeader from "./SearchHeader.svelte";

  let changeLocation: boolean = false;

  $: variableData = $vizStore?.variableData;
  $: defaultGeoVariableData = $vizStore?.defaultGeoVariableData;
  $: params = $page.params;
  $: topicSlug = params.topic;
  $: topic = topics.find((t) => t.slug === topicSlug);
  $: variableSlug = params.variable;
  $: variable = topic.variables.find((v) => v.slug === variableSlug);
  $: search = $page.url.search;
  $: selectedGeographyDisplayName = $selectedGeographyStore?.displayName;
  $: selectedGeographyGeoCode = $selectedGeographyStore?.geoCode;
  $: selectedGeographyGeoType = $selectedGeographyStore?.geoType;
  $: categorySlug = params.category;
  $: category = variable.categories.find((c) => c.slug === categorySlug);

  $: if ($mapStore) {
    let codes = getCodesForCategory(params.topic, params.variable, params.classification, params.category);
    setVizStore({
      ...codes,
      geoType: selectedGeographyGeoType,
      geoCode: selectedGeographyGeoCode,
      bbox: $mapStore.bbox,
    });
  }
</script>

<div class="tw-flex tw-flex-col tw-max-h-full">
  {#if changeLocation}
    <SearchHeader onClose={() => (changeLocation = !changeLocation)} />
  {:else}
    <CategoryHeading {variableData} {variable} {category} location={selectedGeographyDisplayName} />
    <NavigationComponent
      {search}
      {topicSlug}
      currentURL={$page.url.pathname}
      onClick={() => (changeLocation = !changeLocation)}
    />
  {/if}
  <div class="tw-overflow-y-scroll">
    <CategoryLocationSummary
      {variable}
      {variableData}
      {defaultGeoVariableData}
      {category}
      location={selectedGeographyDisplayName}
    />
    <CensusTable {variable} {variableData} />
  </div>
</div>
