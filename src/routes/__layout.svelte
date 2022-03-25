<script>
  import { page } from "$app/stores";
  import { selectedGeographyStore } from "../stores/stores";
  import "mapbox-gl/dist/mapbox-gl.css";
  import "../i18n/i18n.ts";
  import updateSelectedGeography from "../helpers/updateSelectedGeography";
  import Layout from "../components/Layout.svelte";

  import "../app.css";

  $: if ($page) {
    updateSelectedGeography($page.url.search, $selectedGeographyStore);
  }
</script>

<Layout>
  <slot />
</Layout>

<style global>
  @import "./../../node_modules/@ons/design-system/css/main.css";
</style>
