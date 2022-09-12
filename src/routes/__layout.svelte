<script>
  import "mapbox-gl/dist/mapbox-gl.css";
  import "../app.css";
  // import "../components/ons/vars.css";
  // import "../../node_modules/@ons/design-system/css/main.css";
  import "../i18n/i18n.ts";
  import ONSAnalyticsBanner from "../components/ons/ONSAnalyticsBanner.svelte";
  import Layout from "../components/Layout.svelte";
  import { setContentStoresOnce } from "../data/setContentStores";
  import { topicStore } from "../stores/stores";
  import { onMount } from "svelte";

  // GOOGLE ANALYTICS
  // Settings for page analytics. Values must be shared with <AnalyticsBanner> component
  const analyticsId = "GTM-MBCBVQS";
  const analyticsProps = {
    contentTitle: "Census maps",
    releaseDate: "20221018",
    contentType: "exploratory",
  };

  /* 
    Most components loaded will need the topicStore to be populated before they will work properly. As this component 
    loads first, populate the topicStore here! NB - setTopicStoreOnce will only set the topicStore if it is not
    already populated, so can be called every time this component is mounted without doing uneccessary work.
  */
  onMount(async () => setContentStoresOnce());
</script>

<ONSAnalyticsBanner {analyticsId} {analyticsProps} />
{#if $topicStore}
  <Layout>
    <slot />
  </Layout>
{/if}
