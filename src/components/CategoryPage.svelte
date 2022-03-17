<script lang="ts">
	import { page } from '$app/stores';
	import { mapStore } from '../stores/stores';
	import { fetchVizData } from '../data/fetchVizData';
	import { getCodesForCategory } from '../helpers/categoryHelper';
	import RadioButton from '../components/RadioButton.svelte';
	import topics from '../data/curation';

	$: params = $page.params;
	$: topicSlug = params.topic;
	$: topic = topics.find((t) => t.slug === topicSlug);
	$: variableSlug = params.variable;
	$: variable = topic.variables.find((v) => v.slug === variableSlug);
	$: classification = {
		name: 'Default',
		desc: 'Default classification',
		categories: variable.categories
	};
	$: categorySlug = params.category;
	$: search = $page.url.search;

	$: if ($mapStore) {
		let codes = getCodesForCategory(
			params.topic,
			params.variable,
			params.classification,
			params.category
		);
		fetchVizData({ ...codes, geoType: $mapStore.geoType, bbox: $mapStore.bbox });
	}
</script>

<div class="p-6 bg-onspale mb-6">
	<a class="hyperlink" href={`/${search}`}>Home</a> <span class="mx-1">&gt;</span>
	<a class="hyperlink" href={`/2021/${topic.slug}${search}`}>{topic.name}</a>
	<span class="hidden xl:inline">
		<span class="mx-1">&gt;</span>
		{variable.name}
	</span>
</div>

<div class="px-6">
	<h1 class="text-3xl mb-0.5">{variable.name}</h1>
	<div class="mb-6 flex gap-2">
		<div>
			{variable.desc}
		</div>
	</div>

	<div class="flex flex-col text-lg last:border-b-[1px] border-b-red">
		{#each classification.categories as category}
			<a
				href={`/2021/${topicSlug}/${variableSlug}/default/${category.slug}${search}`}
				class="flex gap-2 items-center p-2 border-t-[1px] border-t-slate-300 cursor-pointer 
          {category.slug === categorySlug ? 'bg-onspale' : ''}"
			>
				<RadioButton selected={category.slug === categorySlug} />
				{category.name}
			</a>
		{/each}
	</div>
	<div class="h-[1px] border-t-[1px] mb-6 border-t-slate-300" />

	<div class="mb-6">
		Change the <a class="hyperlink" href={`/2021/${topic.slug}/${variableSlug}${search}`}
			>number of categories</a
		>.
	</div>
</div>

<!--
<div class="p-6 font-mono text-sm bg-onspale mb-6">
  This is the [category]
</div>
-->

<!--
<div class="px-6 font-mono bg-onspale mb-6">
  Proportion of {variable.units.toLowerCase()}, by local authority, {variable.joiner ?? 'with'} {category.name}.
</div>
-->

<!--
<div class="p-6 bg-onspale">
  {$vizStore}
</div>
-->
