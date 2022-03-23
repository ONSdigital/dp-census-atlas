<script>
  import { _ } from "svelte-i18n";
  import CensusPanel from "./CensusPanel.svelte";
  import Heading from "./Heading.svelte";
</script>

<Heading serviceTitle={$_("heading.homePage.serviceTitle")} description={$_("heading.homePage.description")} />
<CensusPanel />
