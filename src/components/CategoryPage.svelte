<script lang="ts">
  import { page } from "$app/stores";
  import { mapStore, selectedGeographyStore } from "../stores/stores";
  import { fetchVizData } from "../data/fetchVizData";
  import { fetchGeographyData } from "../data/fetchGeographyData";
  import { getCodesForCategory, getSelectedGeography } from "../helpers/categoryHelpers";
  import CensusTable from "./CensusTable.svelte";
  import topics from "../data/content";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  import CategoryHeading from "../components/CategoryHeading.svelte";

  $: variableData = $selectedGeographyStore?.variableData;
  $: params = $page.params;
  $: topicSlug = params.topic;
  $: topic = topics.find((t) => t.slug === topicSlug);
  $: variableSlug = params.variable;
  $: variable = topic.variables.find((v) => v.slug === variableSlug);
  $: search = $page.url.search;
  $: selectedGeography = getSelectedGeography($page.url);
  $: selectedGeographyDisplayName = $selectedGeographyStore?.displayName;
  $: categorySlug = params.category;
  $: category = variable.categories.find((c) => c.slug === categorySlug);

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

<div class="tw-p-6 tw-bg-onspale tw-mb-6">
  <a class="tw-hyperlink" href={buildHyperlink({ selectedGeography: $selectedGeographyStore })}>Home</a>
  <span class="tw-mx-1">&gt;</span>
  <a
    class="tw-hyperlink"
    href={buildHyperlink({
      topic: topic.slug,
      selectedGeography: $selectedGeographyStore,
    })}>{topic.name}</a
  >
  <span class="tw-hidden xl:tw-inline">
    <span class="tw-mx-1">&gt;</span>
    {variable.name}
  </span>
</div>

<CensusTable {variable} {variableData} />
