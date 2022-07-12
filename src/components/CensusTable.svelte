<script>
  import { page } from "$app/stores";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  export let variableData, variable;
</script>

<table class="ons-table">
  <thead class="ons-table__head">
    <tr class="ons-table__row">
      <th scope="col" class="ons-table__header" />
      <th scope="col" class="ons-table__header ons-table__header--numeric">
        <span>{variable.units}</span>
      </th>
      <th scope="col" class="ons-table__header ons-table__header--numeric">
        <span>Percentage</span>
      </th>
    </tr>
  </thead>
  <tbody class="ons-table__body">
    {#each variable.categories as category}
      <tr class="ons-table__row" class:ons-table__row--overlay={category.slug === $page.params.category}>
        <td class="ons-table__cell underline" class:ons-table__cell--onSelect={category.slug === $page.params.category}>
          {#if category.slug !== $page.params.category}
            <a
              href={buildHyperlink($page.url, {
                topic: $page.params.topic,
                variable: $page.params.variable,
                category: category.slug,
              })}>{category.name}</a
            >
          {:else}
            {category.name}
          {/if}
        </td>
        <td
          class="ons-table__cell  ons-table__cell--numeric"
          class:ons-table__cell--onSelect={category.slug === $page.params.category}
          >{variableData ? variableData[category?.code]?.count.toLocaleString() : ""}</td
        >
        <td class="ons-table__cell  ons-table__cell--numeric ons-table__cell--key">
          <span
            >{variableData
              ? `${(Math.round(variableData[category?.code]?.percentage * 10) / 10).toFixed(1)}%`
              : ""}</span
          >
        </td>
      </tr>
    {/each}
  </tbody>
</table>
