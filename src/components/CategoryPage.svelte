<script lang="ts">
  import { _ } from "svelte-i18n";
  import { page } from "$app/stores";
  import { mapStore, selectedGeographyStore } from "../stores/stores";
  import { contentStore } from "../stores/stores";
  import { setVizStore } from "../data/setVizStore";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  import CategoryPageLinks from "./CategoryPageLinks.svelte";
  import Heading from "./Heading.svelte";
  import AreaPanel from "./AreaPanel.svelte";
  import RadioButton from "./RadioButton.svelte";

  $: params = $page.params;
  $: variableGroupSlug = params.variableGroup;
  $: variableGroup = $contentStore.variableGroups.find((vg) => vg.slug === variableGroupSlug);
  $: variableSlug = params.variable;
  $: variable = variableGroup.variables.find((v) => v.slug === variableSlug);
  $: classificationSlug = params.classification;
  $: classification = variable.classifications.find((c) => c.slug === classificationSlug);
  $: categorySlug = params.category;
  $: category = classification.categories.find((c) => c.slug === categorySlug);
  $: selectedGeographyDisplayName = $selectedGeographyStore?.displayName;
  $: selectedGeographyGeoCode = $selectedGeographyStore?.geoCode;

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
  <div class="px-6 border-t-[1px] border-t-ons-grey-15">
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
        <div class="">{variable.name}</div>
      </nav>
      <div class="mt-4 mb-2">
        {variable.desc}
      </div>
      <ul class="flex flex-col last:border-b-[1px] mb-4">
        {#each classification.categories as category}
          <li class="">
            <a
              href={buildHyperlink($page.url, {
                variableGroup: variableGroup.slug,
                variable: variable.slug,
                category: {
                  classification: classification.slug,
                  category: category.slug,
                },
              })}
              class="flex gap-2 items-center p-2 border-t-[1px] border-t-slate-300 cursor-pointer custom-ring"
              class:bg-onspale={category.slug === categorySlug}
            >
              <RadioButton selected={category.slug === categorySlug} />
              <div>{category.name}</div>
            </a>
          </li>
        {/each}
      </ul>
      {#if variable.classifications.length > 1}
        <div class="mb-6">
          Change the <a
            href={buildHyperlink($page.url, {
              variableGroup: variableGroup.slug,
              variable: variable.slug,
            })}
            class="hyperlink custom-ring"
          >
            number of categories
          </a>.
        </div>
      {/if}
    </section>
  </div>
  <div class="grow" />
  <div class="p-6 pt-4 bg-ons-grey-5 border-t-ons-grey-15 border-t-[1px]">
    <CategoryPageLinks />
  </div>
</div>
