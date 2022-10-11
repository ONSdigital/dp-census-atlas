<script lang="ts">
  import { _ } from "svelte-i18n";
  import { page } from "$app/stores";
  import { mapStore, selectedGeographyStore } from "../stores/stores";
  import { contentStore } from "../stores/stores";
  import { setVizStore } from "../data/setVizStore";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  import { getDefaultChoroplethClassification } from "../helpers/variableHelpers";
  import CategoryPageLinks from "./CategoryPageLinks.svelte";
  import Heading from "./Heading.svelte";
  import AreaPanel from "./AreaPanel.svelte";
  import RadioButton from "./RadioButton.svelte";

  $: params = $page.params;
  $: variableGroupSlug = params.variableGroup;
  $: variableGroup = $contentStore.variableGroups.find((vg) => vg.slug === variableGroupSlug);
  $: variableSlug = params.variable;
  $: variable = variableGroup.variables.find((v) => v.slug === variableSlug);
  $: selectedGeographyDisplayName = $selectedGeographyStore?.displayName;
  $: selectedGeographyGeoCode = $selectedGeographyStore?.geoCode;
  $: defaultChoroplethClassification = getDefaultChoroplethClassification(variable);
  $: categorySlug = params.category;
  $: category = defaultChoroplethClassification.categories.find((c) => c.slug === categorySlug);

  $: if ($mapStore) {
    setVizStore({
      category: category,
      geoType: $mapStore.geoType,
      geoCode: selectedGeographyGeoCode,
      bbox: $mapStore.bbox,
      zoom: $mapStore.zoom,
      variableGroups: $contentStore.variableGroups,
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

<div class="hidden lg:block ">
  <Heading />
</div>
<div class="h-full flex flex-col">
  <div class="px-6 ">
    <AreaPanel />
    <section class="mb-8">
      <h2 class="pt-3 font-bold text-slate-500">Topic</h2>
      <nav class="flex flex-wrap items-center gap-2 text-xl" aria-label="Breadcrumb">
        <a class="hyperlink" href={buildHyperlink($page.url)}>Home</a>
        <div class="text-sm font-extrabold text-slate-500" aria-hidden>&gt;</div>
        <a class="hyperlink" href={buildHyperlink($page.url, { variableGroup: variableGroup.slug })}
          >{variableGroup.name}</a
        >
        <div class="text-sm font-extrabold text-slate-500" aria-hidden>&gt;</div>
        <div class=" ">{variable.name}</div>
      </nav>
      <div class="mt-4 mb-2">
        <div>
          {variable.desc}
        </div>
        <!--
        <div class="ml-0.5 text-sm bg-ons-census text-white font-bold px-1 rounded-sm">
          {variable.code}
        </div>
        -->
      </div>
      <ul class="flex flex-col last:border-b-[1px]">
        {#each defaultChoroplethClassification.categories as category}
          <li class="">
            <a
              href={buildHyperlink($page.url, {
                variableGroup: variableGroup.slug,
                variable: variable.slug,
                category: category.slug,
              })}
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
  <div class="grow" />
  <div class="p-6 pt-4 bg-ons-grey-5">
    <CategoryPageLinks />
  </div>
</div>
