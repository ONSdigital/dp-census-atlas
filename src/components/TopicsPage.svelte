<script lang="ts">
  import { _ } from "svelte-i18n";
  import Heading from "./Heading.svelte";
  import TopicList from "./TopicList.svelte";
  import { selectedGeographyStore } from "../stores/stores";

  $: selectedGeographyDisplayName = $selectedGeographyStore?.displayName;
</script>

<div class="tw-flex tw-flex-col tw-max-h-full">
  <Heading
    serviceTitle={$_("heading.topicsPage.serviceTitle") +
      `${selectedGeographyDisplayName ? selectedGeographyDisplayName : "England and Wales"}`}
  />
  <TopicList />
</div>
