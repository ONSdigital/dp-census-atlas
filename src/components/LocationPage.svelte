<script lang="ts">
  import Heading from "./Heading.svelte";

  import { selectedGeographyStore } from "../stores/stores";

  $: selectedGeographyDisplayName = $selectedGeographyStore?.displayName;
</script>

<Heading serviceTitle={selectedGeographyDisplayName ? selectedGeographyDisplayName : "England and Wales"} />
