<script>
	import CensusPanel from './CensusPanel.svelte';
	import PlacesPanel from './PlacesPanel.svelte';
	import { Tabs, TabList, TabPanel, Tab } from './tabs/tabs';
</script>

<Tabs>
	<TabList>
		<Tab forInput="search-census-input">Search census</Tab>
		<Tab forInput="search-places-input">Search places</Tab>
	</TabList>
	<TabPanel>
		<CensusPanel />
	</TabPanel>
	<TabPanel>
		<PlacesPanel />
	</TabPanel>
</Tabs>
