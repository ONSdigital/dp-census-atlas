<script lang="ts">
  import { _, json } from "svelte-i18n";
  import { page } from "$app/stores";
  import { selectedGeographyStore } from "../stores/stores";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  import type { LocaleSuggestions } from "../types";
  export let allPeopleTotal: number;
  export let allHouseholdsTotal: number;
  export let title: string;

  $: selectedGeographyDisplayName = $selectedGeographyStore?.displayName
    ? $selectedGeographyStore.displayName
    : $_("defaultGeography");

  const suggestions: LocaleSuggestions = $json("locationPage.suggestions.content");
</script>

<div
  class="tw-px-4 tw-pt-4 ons-card component-margin--2"
  role="region"
  aria-labelledBy="explore-title"
  aria-describedBy="text"
>
  <h2 class="ons-u-fs-m tw-mb-3">{title}</h2>
  <div class="ons-grid explore-container">
    <div class="ons-grid__col ons-col-6@m">
      <div class="ons-pl-grid-col">
        <h3 class="ons-u-fs-s explore-sub-title">{$_("locationOverview.peopleSubTitle")}</h3>
        <p class="ons-u-fs-l explore-data">{allPeopleTotal}</p>
      </div>
    </div>
    <div class="ons-grid__col ons-col-6@m">
      <div class="ons-pl-grid-col">
        <h3 class="ons-u-fs-s explore-sub-title">{$_("locationOverview.householdsSubTitle")}</h3>
        <p class="ons-u-fs-l explore-data">{allHouseholdsTotal}</p>
      </div>
    </div>
  </div>
  <p>
    {$_("locationOverview.content", { values: { selectedGeographyDisplayName: `${selectedGeographyDisplayName}` } })}
  </p>
  <p>
    <a href={buildHyperlink($page.url, null, $_("locationPage.suggestions.title.slug"))}
      >{$_("locationPage.suggestions.title.hyperlink")}</a
    >
    {$_("locationPage.suggestions.title.text")}
  </p>
  <ul class="ons-list ons-list--bare">
    {#each suggestions as { topic, variable, category, label }}
      <li class="ons-list__item">
        <a
          href={buildHyperlink($page.url, {
            topic,
            variable,
            category,
          })}
          class="ons-list__link">{label}</a
        >
      </li>
    {/each}
  </ul>
</div>

<style>
  .explore-container {
    margin-bottom: 1.6rem;
  }
  .explore-sub-title {
    margin-bottom: unset;
  }
  .explore-data {
    margin-bottom: unset;
  }
</style>
