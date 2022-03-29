<script>
  import { page } from "$app/stores";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  export let variableData, variable;
</script>

<div class="tw-px-4 tw-pt-5 tw-pb-5">
  <table class="ons-table ">
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
          <td
            class="ons-table__cell tw-underline"
            class:ons-table__cell--onSelect={category.slug === $page.params.category}
          >
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
</div>

<style>
  .ons-table {
    table-layout: fixed;
    width: calc(100% + 36px);
    margin-left: -18px;
  }
  .ons-table__row--overlay {
    background-color: rgba(229, 229, 229, 1);
  }
  .ons-table__header {
    border-bottom: 0;
    color: #222222;
  }
  th {
    font-weight: normal;
  }
  tr td a {
    font-weight: bold;
  }
  table tr th:nth-child(1) {
    width: 50%;
  }
  table tr th:nth-child(2) {
    width: 20%;
  }
  .ons-table__cell {
    font-size: 18px;
    line-height: 26px;
    border-bottom: 0;
    color: #595959;
    overflow-wrap: anywhere;
  }
  .ons-table__header:first-of-type,
  .ons-table__cell:first-of-type {
    padding-left: 18px;
  }
  .ons-table__header:last-of-type,
  .ons-table__cell:last-of-type {
    padding-right: 18px;
  }

  .ons-table__cell:nth-child(2) {
    padding-left: 0px;
  }
  .ons-table__cell--onSelect {
    font-weight: bold;
    color: #222222;
    text-decoration: unset;
  }
  .ons-table__cell--key {
    font-size: 24px;
    line-height: 24px;
    font-weight: bold;
    color: #222222;
  }
  .ons-table__cell--key span {
    font-size: 20px;
    line-height: 24px;
    font-weight: normal;
  }
</style>
