<script>
  import "../app.css";
  import Layout from "../components/Layout.svelte";
</script>

<Layout>
  <slot />
</Layout>

<style global>
  @import "./../../node_modules/@ons/design-system/css/main.css";
</style>
