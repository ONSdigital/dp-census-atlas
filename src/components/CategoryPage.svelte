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
  <section class="">
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
