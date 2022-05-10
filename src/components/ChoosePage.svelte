<script>
  import { _ } from "svelte-i18n";
  import CensusPanel from "./CensusPanel.svelte";
  import Heading from "./Heading.svelte";
</script>

<svelte:head>
  <title>{$_("homePage.html.title")}</title>
  <meta name="description" content={$_("homePage.html.meta")} />
</svelte:head>

<h1 class="text-4xl font-bold">Census Maps</h1>

<div class="">Choose</div>
