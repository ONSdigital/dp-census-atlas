<script>
  import "mapbox-gl/dist/mapbox-gl.css";
  import "../app.css";
  // import "../components/ons/vars.css";
  // import "../../node_modules/@ons/design-system/css/main.css";
  import "../i18n/i18n.ts";
  import Layout from "../components/Layout.svelte";
  import ServiceUnavailablePage from "../components/ServiceUnavailablePage.svelte";
  import { setContentStoreOnce } from "../data/setContentStore"
  import { contentStore } from "../stores/stores"
  import { onMount } from 'svelte';

  /* 
    Most components loaded will need the contentStore to be populated before they will work properly. As this component 
    loads first, populate the contentStore here! NB - setContentStoreOnce will only set the contentStore if it is not
    already populated, so can be called every time this component is mounted without doing uneccessary work.
  */
  onMount(async () => setContentStoreOnce())
</script>

<!-- Display blank page until contentStore is populated... -->
{#if $contentStore}
  {#if $contentStore.variableGroups.length > 0}
    <!-- Display app if some variableGroups were successfully loaded... -->
    <Layout>
        <slot />
    </Layout>
  {:else}
    <!-- ... otherwise display service unavailable page. -->
    <ServiceUnavailablePage />
  {/if}
{/if}