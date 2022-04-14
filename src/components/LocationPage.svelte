<script type="text/javascript" lang="ts">
  import { page } from "$app/stores";
  import { _ } from "svelte-i18n";

  import { selectedGeographyStore } from "../stores/stores";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";

  import Heading from "./Heading.svelte";
  import LocationOverview from "./LocationOverview.svelte";
  import Icon from "./Icon.svelte";
  import ONSShare from "./ons/ONSShare.svelte";
  import ONSShareItem from "./ons/ONSShareItem.svelte";
  import SearchHeader from "./SearchHeader.svelte";
  import Explore from "./Explore.svelte";

  let changeLocation: boolean = false;

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

<div class="tw-flex tw-flex-col tw-max-h-full">
  {#if changeLocation}
    <SearchHeader onClose={() => (changeLocation = !changeLocation)} />
  {:else}
    <Heading serviceTitle={selectedGeographyDisplayName} />
  {/if}
  <div class="tw-overflow-y-scroll tw-p-3 tw-flex tw-flex-col tw-gap-11">
    <LocationOverview
      {allPeopleTotal}
      {allHouseholdsTotal}
      title={$_("locationOverview.title", {
        values: { selectedGeographyDisplayName: `${selectedGeographyDisplayName}` },
      })}
    />
    <div>
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
    <Explore
      content={[
        {
          label: "Choose a topic",
          href: buildHyperlink($page.url, null, "topics"),
        },
        {
          label: "New location",
          href: "",
          onClick: () => (changeLocation = !changeLocation),
        },
        {
          label: "Back to start",
          href: buildHyperlink($page.url),
        },
      ]}
    />
  </div>
</div>
