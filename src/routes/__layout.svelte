<script>
  import "mapbox-gl/dist/mapbox-gl.css";
  import "../app.css";
  import "../i18n/i18n.ts";
  import Layout from "../components/Layout.svelte";
</script>

<Layout>
  <slot />
</Layout>

<style global>
  @import "./../../node_modules/@ons/design-system/css/main.css";
</style>
