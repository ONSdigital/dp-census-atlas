<script>
  import { selection } from "../../../../../stores/selection";
  import VariablePage from "../../../../../components/VariablePage.svelte";
</script>

{#if $selection.variable}
  <VariablePage />
{/if}
