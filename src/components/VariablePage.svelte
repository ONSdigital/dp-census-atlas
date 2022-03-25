<script lang="ts">
  import { page } from "$app/stores";
  import { numberToWords } from "../util/numberUtil";
  import RightChevron from "./RightChevron.svelte";
  import topics from "../data/content";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";

  $: topicSlug = $page.params.topic;
  $: topic = topics.find((t) => t.slug === topicSlug);
  $: variableSlug = $page.params.variable;
  $: variable = topic.variables.find((v) => v.slug === variableSlug);
</script>

<div class="tw-p-6 tw-bg-onspale tw-mb-6">
  <a class="tw-hyperlink" href={buildHyperlink($page.url)}>Home</a>
  <span class="mx-1">&gt;</span>
  <a
    class="tw-hyperlink"
    href={buildHyperlink($page.url, {
      topic: topicSlug,
    })}>{topic.name}</a
  >
  <span class="tw-hidden xl:tw-inline">
    <span class="tw-mx-1">&gt;</span>
    {variable.name}
  </span>
</div>

<div class="tw-px-6">
  <h1 class="tw-text-3xl tw-mb-0.5">
    {variable.name}
  </h1>
  <div class="tw-mb-6 tw-flex tw-gap-2">
    <div>
      Choose the number of categories for {variable.name}
    </div>
  </div>

  <div class="tw-flex tw-flex-col tw-mb-6 last:tw-border-b-[1px] tw-border-b-slate-300">
    <!-- {#each variable.classifications as classification} -->
    <a
      class="tw-border-t-[1px] tw-border-t-slate-300 tw-py-2 tw-group"
      href={buildHyperlink($page.url, {
        topic: topic.slug,
        variable: variable.slug,
        category: variable.categories[0].slug,
      })}
    >
      <div class="tw-flex tw-justify-between">
        <div class="tw-text-xl tw-hyperlink">
          {numberToWords(variable.categories.length)} categories ({variable.categories.length})
        </div>
        <RightChevron />
      </div>
      <div class="">This is the only classification available</div>
    </a>
    <!-- {/each} -->
  </div>
</div>

<!--
<div class="tw-p-6 tw-font-mono tw-text-sm tw-bg-onspale tw-mb-6">
  This is the [variable] page
</div>
-->
