<script type="text/javascript" lang="ts">
  import { _ } from "svelte-i18n";
  import { page } from "$app/stores";

  import { mapStore, selectedGeographyStore, selectedGeographyVariableStore } from "../stores/stores";
  import topics from "../data/content";
  import { setVizStore } from "../data/setVizStore";
  import { setSelectedGeographyVariableStore } from "../data/setSelectedGeographyVariableStore";
  import { getCodesForCategory } from "../helpers/categoryHelpers";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";

  import CensusTable from "./CensusTable.svelte";
  import NavigationComponent from "./NavigationComponent.svelte";
  import CategoryHeading from "./CategoryHeading.svelte";
  import CategoryLocationSummary from "./CategoryLocationSummary.svelte";
  import SearchHeader from "./SearchHeader.svelte";
  import Icon from "./Icon.svelte";
  import ONSShare from "./ons/ONSShare.svelte";
  import ONSShareItem from "./ons/ONSShareItem.svelte";
  import Explore from "./Explore.svelte";

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
  $: selectedGeographyGeoType = $selectedGeographyStore?.geoType;
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
  <div class="tw-flex tw-flex-col tw-gap-5 tw-p-3 tw-overflow-y-scroll">
    <CategoryLocationSummary
      {variable}
      {variableData}
      {englandAndWalesVariableData}
      {category}
      location={selectedGeographyDisplayName}
    />
    <CensusTable {variable} {variableData} />
    <div>
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
    </div>
    <Explore
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
    />
  </div>
</div>
