
<script>
  import '../app.css'
  import Layout from '../components/Layout.svelte';
</script>

<Layout>
  <slot></slot>
</Layout>

<style lang="scss" global>
  $static: '..' !default;
  @import "./../../node_modules/@ons/design-system/scss/main.scss";
</style>
