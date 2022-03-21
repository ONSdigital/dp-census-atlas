<script lang="ts">
	import { page } from '$app/stores';
	import { mapStore } from '../stores/stores';
	import { fetchVizData } from '../data/fetchVizData';
	import { getCodesForCategory } from '../helpers/categoryHelper';
	import CensusTable from './CensusTable.svelte';
	import topics from '../data/content';

	let geoCode = '';

	//move to helpers
	function getSelectedGeography(pageUrl) {
		//TODO: don't parse manually
		const pageUrlArr = pageUrl.search.split('=');
		const geoCode = pageUrlArr[1];
		const geoType = pageUrlArr[0].slice(1);
		if (geoCode) {
			return { geoType, geoCode };
		} else {
			return { geoType: 'ew', geoCode: 'K04000001' };
		}
	}

	$: params = $page.params;
	$: topicSlug = params.topic;
	$: topic = topics.find((t) => t.slug === topicSlug);
	$: variableSlug = params.variable;
	$: variable = topic.variables.find((v) => v.slug === variableSlug);
	$: search = $page.url.search;
	$: selectedGeography = getSelectedGeography($page.url);

	$: if ($mapStore) {
		let codes = getCodesForCategory(
			params.topic,
			params.variable,
			params.classification,
			params.category
		);
		fetchVizData({ ...codes, geoType: $mapStore.geoType, bbox: $mapStore.bbox, geoCode });
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
