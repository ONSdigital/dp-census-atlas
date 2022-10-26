<script>
  import { selection } from "../../../../../../../stores/selection";
  import Layout from "../../../../../../../components/Layout.svelte";
  import CategoryPage from "../../../../../../../components/CategoryPage.svelte";
</script>

{#if $selection.category}
  <CategoryPage />
{/if}
