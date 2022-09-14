<script lang="ts">
  import { page } from "$app/stores";
  import { numberToWords } from "../util/numberUtil";
  import RightChevron from "./RightChevron.svelte";
  import { contentStore } from "../stores/stores"
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";

  $: variableGroupSlug = $page.params.variableGroup;
  $: variableGroup = $contentStore.variableGroups.find((vg) => vg.slug === variableGroupSlug);
  $: variableSlug = $page.params.variable;
  $: variable = variableGroup.variables.find((v) => v.slug === variableSlug);
</script>

<div class="p-6 bg-onspale mb-6">
  <a class="hyperlink" href={buildHyperlink($page.url)}>Home</a>
  <span class="mx-1">&gt;</span>
  <a
    class="hyperlink"
    href={buildHyperlink($page.url, {
      variableGroup: variableGroupSlug,
    })}>{variableGroup.name}</a
  >
  <span class="hidden xl:inline">
    <span class="mx-1">&gt;</span>
    {variable.name}
  </span>
</div>

<div class="px-6">
  <h1 class="text-3xl mb-0.5">
    {variable.name}
  </h1>
  <div class="mb-6 flex gap-2">
    <div>
      Choose the number of categories for {variable.name}
    </div>
  </div>

  <div class="flex flex-col mb-6 last:border-b-[1px] border-b-slate-300">
    <!-- {#each variable.classifications as classification} -->
    <a
      class="border-t-[1px] border-t-slate-300 py-2 group"
      href={buildHyperlink($page.url, {
        variableGroup: variableGroup.slug,
        variable: variable.slug,
        category: variable.classifications[0].categories[0].slug,
      })}
    >
      <div class="flex justify-between">
        <div class="text-xl hyperlink">
          {numberToWords(variable.classifications[0].categories.length)} categories ({variable.classifications[0].categories.length})
        </div>
        <RightChevron />
      </div>
      <div class="">This is the only classification available</div>
    </a>
    <!-- {/each} -->
  </div>
</div>

<!--
<div class="p-6 font-mono text-sm bg-onspale mb-6">
  This is the [variable] page
</div>
-->
