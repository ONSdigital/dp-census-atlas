<script lang="ts">
  import { page } from "$app/stores";
  import { mapStore, selectedGeographyStore } from "../stores/stores";
  import { fetchVizData } from "../data/fetchVizData";
  import { fetchGeographyData } from "../data/fetchGeographyData";
  import { getCodesForCategory, getSelectedGeography } from "../helpers/categoryHelper";
  import CensusTable from "./CensusTable.svelte";
  import NavigationComponent from "./NavigationComponent.svelte";
  import topics from "../data/content";
  import CategoryHeading from "../components/CategoryHeading.svelte";

  $: variableData = $selectedGeographyStore?.variableData;
  $: selectedGeographyDisplayName = $selectedGeographyStore?.displayName;
  $: params = $page.params;
  $: topicSlug = params.topic;
  $: topic = topics.find((t) => t.slug === topicSlug);
  $: variableSlug = params.variable;
  $: variable = topic.variables.find((v) => v.slug === variableSlug);
  $: categorySlug = params.category;
  $: category = variable.categories.find((c) => c.slug === categorySlug);
  $: search = $page.url.search;
  $: selectedGeography = getSelectedGeography($page.url);

  $: if ($mapStore) {
    let codes = getCodesForCategory(params.topic, params.variable, params.classification, params.category);
    fetchVizData({ ...codes, geoType: $mapStore.geoType, bbox: $mapStore.bbox });
    fetchGeographyData({
      totalCode: codes.totalCode,
      categoryCodes: codes.categoryCodes,
      geoCode: selectedGeography.geoCode,
    });
  }
</script>

<CategoryHeading {variableData} {variable} {category} location={selectedGeographyDisplayName} />

<NavigationComponent
  {search}
  {topicSlug}
  currentURL={$page.url.pathname}
  onClick={() => {
    console.log($page.url.pathname);
  }}
/>
<CensusTable {variable} {variableData} />
