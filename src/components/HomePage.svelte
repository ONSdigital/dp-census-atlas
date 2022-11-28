<script>
  import { content } from "../stores/content";
  import { isInitialReleasePeriod, getLatestRelease } from "../helpers/contentHelpers";
  import VariableGroupList from "./VariableGroupList.svelte";
  import AreaPanel from "./AreaPanel.svelte";
  import SearchBox from "./SearchBox.svelte";
  import DemMigExamples from "./DemMigExamples.svelte";
  import ArmEilrExamples from "./ArmEilrExamples.svelte";
</script>

<div class="px-6">
  <AreaPanel />
  <section>
    <h2 class="pt-3 pb-2 font-bold text-slate-500">Topic</h2>
    <div class="mb-6">
      <SearchBox name="search-census" />
    </div>
    <VariableGroupList />

    {#if isInitialReleasePeriod($content)}
      <div class="mb-7">
        Further topic data will be released according to the topic summaries <a
          href="https://census.gov.uk/census-2021-results/phase-one-topic-summaries"
          class="hyperlink">release schedule</a
        >.
      </div>
    {/if}

    <div class="bg-ons-grey-5 p-6 mb-6">
      <h3 class="pb-3 text-xl font-semibold ">Examples</h3>
      <ul>
        {#if getLatestRelease($content) === 'DemMig'}
          <DemMigExamples />
        {:else if getLatestRelease($content) === 'ArmEilr'}
          <ArmEilrExamples />
        {/if}
      </ul>
    </div>
  </section>
</div>
