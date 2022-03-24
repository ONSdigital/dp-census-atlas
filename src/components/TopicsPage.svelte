<script lang="ts">
  import { _ } from "svelte-i18n";
  import Heading from "./Heading.svelte";
  import TopicList from "./TopicList.svelte";
  import { selectedGeographyStore } from "../stores/stores";

  $: selectedGeographyDisplayName = $selectedGeographyStore?.displayName;
</script>

<Heading
  serviceTitle={$_("heading.topicsPage.serviceTitle") +
    `${selectedGeographyDisplayName ? selectedGeographyDisplayName : "England and Wales"}`}
/>
<TopicList />
