<script>
  import { content } from "../stores/content";
  import { isInitialReleasePeriod, getLatestRelease } from "../helpers/contentHelpers";
  import VariableGroupList from "./VariableGroupList.svelte";
  import AreaPanel from "./AreaPanel.svelte";
  import SearchBox from "./SearchBox.svelte";
  import DemMigExamples from "./examples/DemMigExamples.svelte";
  import ArmEilrExamples from "./examples/ArmEilrExamples.svelte";
  import LabTtwWelshSkillsExamples from "./examples/LabTtwWelshSkillsExamples.svelte";
  import HouExamples from "./examples/HouExamples.svelte";
  import SogiExamples from "./examples/SogiExamples.svelte";
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
      <div>
        Further topic data will be released according to the topic summaries <a
          href="https://census.gov.uk/census-2021-results/phase-one-topic-summaries"
          class="hyperlink">release schedule</a
        >.
      </div>
    {/if}

    <div class="bg-ons-grey-5 p-6 mt-8 mb-9">
      <h3 class="pb-3 text-xl font-semibold ">Examples</h3>
      <ul>
        {#if getLatestRelease($content) === "DemMig"}
          <DemMigExamples />
        {:else if getLatestRelease($content) === "ArmEilr"}
          <ArmEilrExamples />
        {:else if getLatestRelease($content) === "LabTtwWelshSkills"}
          <LabTtwWelshSkillsExamples />
        {:else if getLatestRelease($content) === "Hou"}
          <HouExamples />
        {:else if getLatestRelease($content) === "Sogi"}
          <SogiExamples />
        {/if}
      </ul>
    </div>
  </section>
</div>

<div class="grow" />
