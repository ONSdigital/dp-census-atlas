<script lang="ts">
  import { page } from "$app/stores";
  import { _ } from "svelte-i18n";

  import { selectedGeographyStore } from "../stores/stores";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";

  import SearchHeader from "./SearchHeader.svelte";
  import Heading from "./Heading.svelte";
  import TopicList from "./TopicList.svelte";
  import Explore from "./Explore.svelte";

  let changeLocation: boolean = false;

  $: selectedGeographyDisplayName = $selectedGeographyStore?.displayName;
</script>

<div class="flex flex-col max-h-full">
  {#if changeLocation}
    <SearchHeader onClose={() => (changeLocation = !changeLocation)} />
  {:else}
    <Heading
      serviceTitle={$_("topicsPage.heading.serviceTitle", {
        values: {
          selectedGeographyDisplayName: selectedGeographyDisplayName
            ? selectedGeographyDisplayName
            : $_("defaultGeography"),
        },
      })}
    />
  {/if}

  <div class="flex flex-col overflow-y-scroll p-5 gap-11">
    <TopicList />
    <Explore
      content={[
        {
          label: selectedGeographyDisplayName ? $_("explore.chooseLocationLabel") : $_("explore.newLocationLabel"),
          href: "",
          onClick: () => (changeLocation = !changeLocation),
        },
        {
          label: $_("explore.backToStartLabel"),
          href: buildHyperlink($page.url),
        },
      ]}
    />
  </div>
</div>
