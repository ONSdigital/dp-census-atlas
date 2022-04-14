<script type="text/javascript">
  import { _ } from "svelte-i18n";
  import CensusPanel from "./CensusPanel.svelte";
  import Heading from "./Heading.svelte";
</script>

<svelte:head>
  <title>{$_("homePage.html.title")}</title>
  <meta name="description" content={$_("homePage.html.meta")} />
</svelte:head>

<div class="tw-flex tw-flex-col tw-max-h-full">
  <Heading serviceTitle={$_("homePage.heading.serviceTitle")} description={$_("homePage.heading.description")} />
  <CensusPanel />
</div>
