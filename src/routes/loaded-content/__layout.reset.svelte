<script>
  import "mapbox-gl/dist/mapbox-gl.css";
  import "../../app.css";
  import "../../i18n/i18n.ts";
  import Layout from "../../components/Layout.svelte";
  import { setContentStoreOnce } from "../../data/setContentStore"
  import { contentStore } from "../../stores/stores"
  import { onMount } from 'svelte';

  /* 
    Most components loaded will need the contentStore to be populated before they will work properly. As this component 
    loads first, populate the contentStore here! NB - setContentStoreOnce will only set the contentStore if it is not
    already populated, so can be called every time this component is mounted without doing uneccessary work.
  */
  onMount(async () => setContentStoreOnce())
</script>

{#if $contentStore}
  <Layout drawMap={false}>
      <slot />
  </Layout>
{/if}