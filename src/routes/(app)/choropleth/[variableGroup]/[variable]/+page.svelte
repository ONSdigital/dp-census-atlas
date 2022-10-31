<script>
  import { params } from "../../../../../stores/params";
  import VariablePage from "../../../../../components/VariablePage.svelte";
</script>

{#if $params.variable}
  <VariablePage />
{/if}
