<script lang="ts">
  import "mapbox-gl/dist/mapbox-gl.css";
  import "tippy.js/dist/tippy.css";
  import "../app.css";
  import pym from "pym.js";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { content } from "../stores/content";
  import { setContentStoreOnce } from "../data/setContentStore";
  import { geography } from "../stores/geography";
  import Loading from "./Loading.svelte";
  import ServiceUnavailablePage from "./ServiceUnavailablePage.svelte";

  onMount(async () => {
    setContentStoreOnce();

    // tell iframe host using pym.js to set iframe height to 570px
    new pym.Child().sendMessage("height", "570");
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
    ? `${parseParam("variable")} - Subnational indicator maps, ONS`
    : "Subnational indicator maps, ONS";
  $: url = "https://www.ons.gov.uk" + $page.url.pathname;
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
  <meta property="og:description" content="Use our maps to find out about your local area." />
  <meta name="description" content="Use our maps to find out about your local area." />
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
