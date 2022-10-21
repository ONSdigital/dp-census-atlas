<script>
  import { _ } from "svelte-i18n";
  import { contentStore } from "../stores/stores";
  import { isInitialReleasePeriod } from "../helpers/contentHelpers";
  import Heading from "./Heading.svelte";
  import VariableGroupList from "./VariableGroupList.svelte";
  import AreaPanel from "./AreaPanel.svelte";
  import SearchBox from "./SearchBox.svelte";
  import Examples from "./Examples.svelte";
</script>

<svelte:head>
  <title>{$_("homePage.html.title")}</title>
  <meta name="description" content={$_("homePage.html.meta")} />
</svelte:head>

<Heading />

<div class="px-6">
  <AreaPanel />
  <section>
    <h2 class="pt-3 pb-2 font-bold text-slate-500">Topic</h2>
    <div class="mb-6">
      <SearchBox name="search-census" />
    </div>
    <VariableGroupList />

    {#if isInitialReleasePeriod($contentStore)}
      <div class="bg-ons-grey-5 p-6 mb-6">
        <h3 class="pb-2 text-xl font-semibold ">Examples</h3>
        <ul>
          <Examples />
        </ul>
      </div>
      <div class="mb-3">
        Further topic data will be released according to the topic summaries <a
          href="https://census.gov.uk/census-2021-results/phase-one-topic-summaries"
          class="hyperlink">release schedule</a
        >.
      </div>
    {/if}
  </section>
</div>
