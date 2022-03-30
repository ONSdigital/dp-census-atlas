<script lang="ts">
  import { _ } from "svelte-i18n";
  import Heading from "./Heading.svelte";
  import LocationOverview from "./LocationOverview.svelte";
  import { selectedGeographyStore } from "../stores/stores";

  $: selectedGeographyDisplayName = $selectedGeographyStore?.displayName;
  $: allHouseholdsTotal = $selectedGeographyStore?.allHouseholdsTotal;
  $: allPeopleTotal = $selectedGeographyStore?.allPeopleTotal;
</script>

<Heading serviceTitle={selectedGeographyDisplayName ? selectedGeographyDisplayName : "England and Wales"} />
<LocationOverview
  {allPeopleTotal}
  {allHouseholdsTotal}
  title="{$_('locationOverview.title')} {selectedGeographyDisplayName
    ? selectedGeographyDisplayName
    : 'England and Wales'}"
/>
