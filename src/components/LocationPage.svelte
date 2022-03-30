<script lang="ts">
  import { _ } from "svelte-i18n";
  import Heading from "./Heading.svelte";
  import LocationOverview from "./LocationOverview.svelte";
  import { selectedGeographyStore } from "../stores/stores";

  $: selectedGeographyDisplayName = $selectedGeographyStore?.displayName
    ? $selectedGeographyStore.displayName
    : $_("defaultGeography");
  $: allHouseholdsTotal = $selectedGeographyStore?.allHouseholdsTotal;
  $: allPeopleTotal = $selectedGeographyStore?.allPeopleTotal;
</script>

<Heading serviceTitle={selectedGeographyDisplayName} />
<LocationOverview
  {allPeopleTotal}
  {allHouseholdsTotal}
  title={$_("locationOverview.title", { values: { selectedGeographyDisplayName: `${selectedGeographyDisplayName}` } })}
/>
