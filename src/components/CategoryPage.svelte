<script lang="ts">
  import { page } from "$app/stores";
  import { mapStore, selectedGeographyStore, vizStore } from "../stores/stores";
  import { fetchVizData } from "../data/fetchVizData";
  import { getCodesForCategory } from "../helpers/categoryHelpers";
  import CensusTable from "./CensusTable.svelte";
  import NavigationComponent from "./NavigationComponent.svelte";
  import topics from "../data/content";
  import CategoryHeading from "../components/CategoryHeading.svelte";

  $: variableData = $vizStore?.variableData;
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
    fetchVizData({
      ...codes,
      geoType: $mapStore.geoType,
      geoCode: selectedGeographyGeoCode,
      bbox: $mapStore.bbox,
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
