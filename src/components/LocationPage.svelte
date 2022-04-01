<script lang="ts">
  import { _ } from "svelte-i18n";
  import Heading from "./Heading.svelte";
  import LocationOverview from "./LocationOverview.svelte";
  import Icon from "./Icon.svelte";
  import ONSShare from "./ons/ONSShare.svelte";
  import ONSShareItem from "./ons/ONSShareItem.svelte";
  import { selectedGeographyStore } from "../stores/stores";

  $: selectedGeographyDisplayName = $selectedGeographyStore?.displayName
    ? $selectedGeographyStore.displayName
    : $_("defaultGeography");
  $: allHouseholdsTotal = $selectedGeographyStore?.allHouseholdsTotal;
  $: allPeopleTotal = $selectedGeographyStore?.allPeopleTotal;
</script>

<svelte:head>
  <title
    >{$_("locationPage.html.title", {
      values: { selectedGeographyDisplayName: `${selectedGeographyDisplayName}` },
    })}</title
  >
</svelte:head>

<Heading serviceTitle={selectedGeographyDisplayName} />
<LocationOverview
  {allPeopleTotal}
  {allHouseholdsTotal}
  title={$_("locationOverview.title", { values: { selectedGeographyDisplayName: `${selectedGeographyDisplayName}` } })}
/>
<div class="tw-p-5">
  <ONSShare title={$_("share.title")}>
    <ONSShareItem label="Facebook" type="facebook"><Icon type="facebook" /></ONSShareItem>
    <ONSShareItem label="Twitter" type="twitter"><Icon type="twitter" /></ONSShareItem>
    <ONSShareItem label="Linkedin" type="linkedin"><Icon type="linkedin" /></ONSShareItem>
    <ONSShareItem
      title={$_("locationPage.html.title", {
        values: { selectedGeographyDisplayName: `${selectedGeographyDisplayName}` },
      })}
      label="Email"
      type="email"><Icon type="email" /></ONSShareItem
    >
  </ONSShare>
</div>
