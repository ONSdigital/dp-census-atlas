<script lang="ts">
  import { _ } from "svelte-i18n";
  import { page } from "$app/stores";
  import Heading from "./Heading.svelte";
  import LocationOverview from "./LocationOverview.svelte";
  import { selectedGeographyStore } from "../stores/stores";

  $: selectedGeographyDisplayName = $selectedGeographyStore?.displayName;
  $: search = $page.url.search;
</script>

<Heading serviceTitle={selectedGeographyDisplayName ? selectedGeographyDisplayName : "England and Wales"} />
<LocationOverview
  {search}
  allPeopleTotal="test1"
  allHouseholdsTotal="test2"
  title="{$_('locationOverview.title')} {selectedGeographyDisplayName
    ? selectedGeographyDisplayName
    : 'England and Wales'}"
/>
