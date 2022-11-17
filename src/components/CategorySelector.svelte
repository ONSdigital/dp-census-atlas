<script lang="ts">
  import { page } from "$app/stores";
  import { viz } from "../stores/viz";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  import { gotoUrl } from "../helpers/navigationHelper";

  let selected: string;

  const handleChange = () => {
    const link = buildHyperlink($page.url, {
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
    class="text-sm sm:text-base lg:text-lg font-bold p-1 custom-ring border-2 border-ons-ocean-blue overflow-visible"
  >
    {#each $viz.params.classification.categories as category}
      <option value={category.slug}>{category.legend_str_3}</option>
    {/each}
  </select>
</div>
