<script lang="ts">
  import { viz } from "../stores/viz";
  import MultiCategoryMapLegend from "./MultiCategoryMapLegend.svelte";
  import SingleCategoryMapLegend from "./SingleCategoryMapLegend.svelte";
</script>

{#if $viz?.kind === "single-category"}
  <SingleCategoryMapLegend />
{:else}
  <MultiCategoryMapLegend />
{/if}
