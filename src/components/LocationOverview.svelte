<script lang="ts">
  import { _ } from "svelte-i18n";
  import { selectedGeographyStore } from "../stores/stores";
  export let allPeopleTotal: string;
  export let search: string;
  export let allHouseholdsTotal: string;
  export let title: string;
  $: selectedGeographyDisplayName = $selectedGeographyStore?.displayName;
</script>

<div class="ons-card component-margin--2" role="region" aria-labelledBy="explore-title" aria-describedBy="text">
  <h2 class="ons-u-fs-m">{title}</h2>
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
    The 2021 Census tells us a lot about how people in {selectedGeographyDisplayName
      ? selectedGeographyDisplayName
      : "England and Wales"} live and work.
  </p>
  <p>
    <a href="topics{search}">Choose a topic from the full list</a> or explore one of these suggestions.
  </p>
  <ul class="ons-list ons-list--bare">
    <li class="ons-list__item">
      <a
        href="education/highest-level-of-qualification-gained/default/level-4-qualifications-and-above{search}"
        class="ons-list__link">People with a Level 4 education or above.</a
      >
    </li>
    <li class="ons-list__item">
      <a href="health/general-health/default/good{search}" class="ons-list__link">Residents general health.</a>
    </li>
    <li class="ons-list__item">
      <a href="housing/size-of-household/default/2-person-household{search}" class="ons-list__link"
        >What is the most common household size?</a
      >
    </li>
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
