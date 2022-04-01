<script lang="ts">
  import { _ } from "svelte-i18n";
  import Heading from "./Heading.svelte";
  import TopicList from "./TopicList.svelte";
  import { selectedGeographyStore } from "../stores/stores";

  $: selectedGeographyDisplayName = $selectedGeographyStore?.displayName;
</script>

<div class="tw-flex tw-flex-col tw-max-h-full">
  <Heading
    serviceTitle={$_("topicsPage.heading.serviceTitle", {
      values: {
        selectedGeographyDisplayName: selectedGeographyDisplayName ? selectedGeographyDisplayName : "England and Wales",
      },
    })}
  />
  <div class="tw-overflow-y-scroll tw-p-5">
    <TopicList />
  </div>
</div>
