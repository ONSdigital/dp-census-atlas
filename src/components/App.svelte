<script lang="ts">
  import "mapbox-gl/dist/mapbox-gl.css";
  import "../app.css";
  import "../i18n/i18n.ts";
  import pym from "pym.js";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { setContentStoreOnce } from "../data/setContentStore";
  import { content } from "../stores/content";
  import { geography } from "../stores/geography";
  import Loading from "./Loading.svelte";
  import ServiceUnavailablePage from "./ServiceUnavailablePage.svelte";

  onMount(async () => {
    setContentStoreOnce();

    // tell iframe host using pym.js to set iframe height to 600px
    new pym.Child().sendMessage("height", "600");
  });

  $: console.log($page);
</script>

<svelte:head>
  <title>Census maps - Census 2021 data interactive, ONS</title>
  <link rel="canonical" href="{$page.url.origin}{$page.url.pathname}" />
  <meta property="og:title" content="Census maps - Census 2021 data interactive, ONS" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="{$page.url.origin}{$page.url.pathname}" />
  <meta property="og:image" content="https://www.ons.gov.uk/census/maps/img/og-image.png" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="940" />
  <meta property="og:image:height" content="492" />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:image" content="https://www.ons.gov.uk/census/maps/img/og-image.png" />
  <meta
    property="og:description"
    content="Census maps is an interactive tool to explore Census 2021 data across England and Wales for different topics down to a neighbourhood level."
  />
  <meta
    name="description"
    content="Census maps is an interactive tool to explore Census 2021 data across England and Wales for different topics down to a neighbourhood level."
  />
</svelte:head>

{#if $content && $geography}
  {#if $content.variableGroups.length > 0}
    <slot />
  {:else}
    <ServiceUnavailablePage />
  {/if}
{:else}
  <Loading />
{/if}
