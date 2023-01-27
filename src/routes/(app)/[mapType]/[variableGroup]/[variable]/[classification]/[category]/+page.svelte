<script>
  import { params } from "../../../../../../../stores/params";
  import Layout from "../../../../../../../components/Layout.svelte";
  import CategoryPage from "../../../../../../../components/CategoryPage.svelte";
</script>

{#if $params.category}
  <CategoryPage />
{/if}
