<script lang="ts">
	import { page } from '$app/stores';
	import { mapStore } from '../stores/stores';
	import { fetchVizData, fetchCensusTableData } from '../data/fetchVizData';
	import { getCodesForCategory } from '../helpers/categoryHelper';
	import CensusTable from './CensusTable.svelte';
	import topics from '../data/content';

	let geoCode = '';

	$: params = $page.params;
	$: topicSlug = params.topic;
	$: topic = topics.find((t) => t.slug === topicSlug);
	$: variableSlug = params.variable;
	$: variable = topic.variables.find((v) => v.slug === variableSlug);

	$: console.log(variable.categories);
	$: search = $page.url.search;

	$: search ? (geoCode = search.split('=').at[-1]) : (geoCode = 'K04000001');

	$: if ($mapStore) {
		let codes = getCodesForCategory(
			params.topic,
			params.variable,
			params.classification,
			params.category
		);
		fetchVizData({ ...codes, geoType: $mapStore.geoType, bbox: $mapStore.bbox });
		fetchCensusTableData({
			geoCode: geoCode,
			tableCode: variable.code,
			totalCode: codes.totalCode
		});
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
<CensusTable {variable} />

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
