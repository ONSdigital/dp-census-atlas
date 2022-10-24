<script lang="ts">
  import "mapbox-gl/dist/mapbox-gl.css";
  import "../app.css";
  import "../i18n/i18n.ts";
  import pym from "pym.js";
  import { onMount } from "svelte";
  import { setContentStoreOnce } from "../data/setContentStore";
  import { contentStore } from "../stores/stores";
  import Loading from "./Loading.svelte";
  import ServiceUnavailablePage from "./ServiceUnavailablePage.svelte";
  import { page } from "$app/stores";

  onMount(async () => {
    setContentStoreOnce();

    // tell iframe host using pym.js to set iframe height to 600px
    new pym.Child().sendMessage("height", "600");
  });
</script>

{#if $page && $contentStore}
  {#if $contentStore.variableGroups.length > 0}
    <slot />
  {:else}
    <ServiceUnavailablePage />
  {/if}
{:else}
  <Loading />
{/if}
