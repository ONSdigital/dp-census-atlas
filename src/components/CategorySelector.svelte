<script lang="ts">
  import { page } from "$app/stores";
  import { viz } from "../stores/viz";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  import { gotoUrl } from "../helpers/navigationHelper";

  export let selected: string;
  export let use: "name" | "legendString";

  const handleChange = () => {
    const link = buildHyperlink($page.url, {
      mode: $viz.params.mode,
      variableGroup: $viz.params.variableGroup.slug,
      variable: $viz.params.variable.slug,
      category: {
        classification: $viz.params.classification.slug,
        category: selected,
      },
    });
    gotoUrl(link);
  };
</script>

<div class="mt-1 mb-0.5">
  <select
    bind:value={selected}
    on:change={handleChange}
    name="select"
    class="text-sm sm:text-base lg:text-lg font-bold p-1 custom-ring border-2 border-ons-ocean-blue max-w-[15rem] xs:max-w-[20rem] sm:max-w-[31rem] md:max-w-none"
  >
    {#each $viz.params.classification.categories as category}
      {#if use === "legendString"}
        <option value={category.slug}>{category.legend_str_3}</option>
      {:else if use === "name"}
        <option value={category.slug}>{category.name}</option>
      {/if}
    {/each}
  </select>
</div>
