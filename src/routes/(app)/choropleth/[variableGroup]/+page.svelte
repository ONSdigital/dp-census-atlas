<script>
  import { selection } from "../../../../stores/selection";
  import VariableGroupPage from "../../../../components/VariableGroupPage.svelte";
</script>

{#if $selection.variableGroup}
  <VariableGroupPage />
{/if}
