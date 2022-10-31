<script>
  import { params } from "../../../../stores/params";
  import VariableGroupPage from "../../../../components/VariableGroupPage.svelte";
</script>

{#if $params.variableGroup}
  <VariableGroupPage />
{/if}
