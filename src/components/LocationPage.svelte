<script lang="ts">
  import { _ } from "svelte-i18n";
  import Heading from "./Heading.svelte";
  import LocationOverview from "./LocationOverview.svelte";
  import { selectedGeographyStore } from "../stores/stores";
  import { fetchSelectedGeographyData, parseSelectedGeographyData } from "../data/fetchVizData";
  import { getCodesForCategory } from "../helpers/categoryHelpers";

  let householdsCodes = getCodesForCategory("housing", "size-of-household", "default", "1-person-households");
  let peopleCodes = getCodesForCategory("health", "general-health", "default", "very-good");
  let allHouseholdsTotal = "";
  let allPeopleTotal = "";

  $: selectedGeographyDisplayName = $selectedGeographyStore?.displayName;

  $: if ($selectedGeographyStore.geoCode) {
    fetchSelectedGeographyData({
      totalCode: householdsCodes.totalCode,
      categoryCodes: householdsCodes.categoryCodes,
      geoCode: $selectedGeographyStore.geoCode,
    }).then((table) => {
      allHouseholdsTotal = parseSelectedGeographyData(table, householdsCodes.totalCode).selectedGeographyTotal;
    });
    fetchSelectedGeographyData({
      totalCode: peopleCodes.totalCode,
      categoryCodes: peopleCodes.categoryCodes,
      geoCode: $selectedGeographyStore.geoCode,
    }).then((table) => {
      allPeopleTotal = parseSelectedGeographyData(table, peopleCodes.totalCode).selectedGeographyTotal;
    });
  }
</script>

<Heading serviceTitle={selectedGeographyDisplayName ? selectedGeographyDisplayName : "England and Wales"} />
<LocationOverview
  {allPeopleTotal}
  {allHouseholdsTotal}
  title="{$_('locationOverview.title')} {selectedGeographyDisplayName
    ? selectedGeographyDisplayName
    : 'England and Wales'}"
/>
