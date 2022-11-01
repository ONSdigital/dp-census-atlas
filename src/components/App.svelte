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

  function parseSlug(slug) {
    let string = slug.replaceAll("-", " ").replace("uk", "UK");
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  function parseParam(code) {
    let slug = $page.params[code];
    return slug ? parseSlug(slug) : undefined;
  }
  $: title = $page.params.variable
    ? `${parseParam("variable")} - Census Maps, ONS`
    : "Census Maps - Census 2021 data interactive, ONS";
  $: url = $page.url.origin + $page.url.pathname;
</script>

<svelte:head>
  <title>{title}</title>
  <link rel="canonical" href={url} />
  <meta property="og:title" content={title} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={url} />
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
