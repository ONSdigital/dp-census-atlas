<script lang="ts">
  import { _ } from "svelte-i18n";
  import { page } from "$app/stores";
  import { mapStore, selectedGeographyStore } from "../stores/stores";
  import topics from "../data/content";
  import { setVizStore } from "../data/setVizStore";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  import Heading from "./Heading.svelte";
  import AreaPanel from "./AreaPanel.svelte";
  import RadioButton from "./RadioButton.svelte";

  $: params = $page.params;
  $: topicSlug = params.topic;
  $: topic = topics.find((t) => t.slug === topicSlug);
  $: variableSlug = params.variable;
  $: variable = topic.variables.find((v) => v.slug === variableSlug);
  $: selectedGeographyDisplayName = $selectedGeographyStore?.displayName;
  $: selectedGeographyGeoCode = $selectedGeographyStore?.geoCode;
  $: categorySlug = params.category;
  $: category = variable.categories.find((c) => c.slug === categorySlug);

  $: if ($mapStore) {
    setVizStore({
      categoryCode: category.code,
      geoType: $mapStore.geoType,
      geoCode: selectedGeographyGeoCode,
      bbox: $mapStore.bbox,
      zoom: $mapStore.zoom,
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

<Heading />
<div class="px-6">
  <AreaPanel />
  <section>
    <h2 class="pt-3 font-bold text-slate-500">Topic</h2>
    <nav class="flex flex-wrap items-center gap-2 text-xl" aria-label="Breadcrumb">
      <a class="hyperlink" href={buildHyperlink($page.url)}>Home</a>
      <div class="text-sm font-extrabold text-slate-500" aria-hidden>&gt;</div>
      <a class="hyperlink" href={buildHyperlink($page.url, { topic: topic.slug })}>{topic.name}</a>
      <div class="text-sm font-extrabold text-slate-500" aria-hidden>&gt;</div>
      <div class=" ">{variable.name}</div>
    </nav>
    <div class="mt-4 mb-2 flex items-center gap-2">
      <div>
        {variable.desc}
      </div>
      <div class="ml-0.5 text-sm bg-ons-census text-white font-bold px-1 rounded-sm">
        {variable.code}
      </div>
    </div>
    <ul class="flex flex-col last:border-b-[1px] border-b-red">
      {#each variable.categories as category}
        <li class="">
          <a
            href={buildHyperlink($page.url, { topic: topic.slug, variable: variable.slug, category: category.slug })}
            class="flex gap-2 items-center p-2 border-t-[1px] border-t-slate-300 cursor-pointer
              {category.slug === categorySlug ? 'bg-onspale' : ''}"
          >
            <RadioButton selected={category.slug === categorySlug} />
            {category.name}
          </a>
        </li>
      {/each}
    </ul>
  </section>
</div>

<div class="mt-48">
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
  aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
  occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
</div>
<div class="">
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
  aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
  occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
</div>
<div class="">
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
  aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
  occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
</div>
<div class="">
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
  aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
  occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
</div>

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

<!-- <CensusTable {variable} {variableData} /> -->
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
