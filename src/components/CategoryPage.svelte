<script lang="ts">
  import { page } from "$app/stores";
  import { mapStore } from "../stores/stores";
  import { fetchVizData } from "../data/fetchVizData";
  import { getCodesForCategory } from "../helpers/categoryHelper";
  import RadioButton from "../components/RadioButton.svelte";
  import topics from "../data/content";

  $: params = $page.params;
  $: topicSlug = params.topic;
  $: topic = topics.find((t) => t.slug === topicSlug);
  $: variableSlug = params.variable;
  $: variable = topic.variables.find((v) => v.slug === variableSlug);
  $: classification = {
    name: "Default",
    desc: "Default classification",
    categories: variable.categories,
  };
  $: categorySlug = params.category;
  $: search = $page.url.search;

  $: if ($mapStore) {
    let codes = getCodesForCategory(params.topic, params.variable, params.classification, params.category);
    fetchVizData({ ...codes, geoType: $mapStore.geoType, bbox: $mapStore.bbox });
  }
</script>

<div class="tw-p-6 tw-bg-onspale tw-mb-6">
  <a class="tw-hyperlink" href={`/${search}`}>Home</a> <span class="tw-mx-1">&gt;</span>
  <a class="tw-hyperlink" href={`/2021/${topic.slug}${search}`}>{topic.name}</a>
  <span class="tw-hidden xl:tw-inline">
    <span class="tw-mx-1">&gt;</span>
    {variable.name}
  </span>
</div>

<div class="tw-px-6">
  <h1 class="tw-text-3xl tw-mb-0.5">{variable.name}</h1>
  <div class="tw-mb-6 tw-flex tw-gap-2">
    <div>
      {variable.desc}
    </div>
  </div>

  <div class="tw-flex tw-flex-col tw-text-lg last:tw-border-b-[1px] tw-border-b-red">
    {#each classification.categories as category}
      <a
        href={`/2021/${topicSlug}/${variableSlug}/default/${category.slug}${search}`}
        class="tw-flex tw-gap-2 tw-items-center tw-p-2 tw-border-t-[1px] tw-border-t-slate-300 tw-cursor-pointer 
          {category.slug === categorySlug ? 'tw-bg-onspale' : ''}"
      >
        <RadioButton selected={category.slug === categorySlug} />
        {category.name}
      </a>
    {/each}
  </div>
  <div class="tw-h-[1px] tw-border-t-[1px] tw-mb-6 tw-border-t-slate-300" />

  <div class="tw-mb-6">
    Change the <a class="tw-hyperlink" href={`/2021/${topic.slug}/${variableSlug}${search}`}>number of categories</a>.
  </div>
</div>

<!--
<div class="tw-p-6 tw-font-mono tw-text-sm tw-bg-onspale tw-mb-6">
  This is the [category]
</div>
-->

<!--
<div class="tw-px-6 tw-font-mono tw-bg-onspale tw-mb-6">
  Proportion of {variable.units.toLowerCase()}, by local authority, {variable.joiner ?? 'with'} {category.name}.
</div>
-->

<!--
<div class="tw-p-6 tw-bg-onspale">
  {$vizStore}
</div>
-->
