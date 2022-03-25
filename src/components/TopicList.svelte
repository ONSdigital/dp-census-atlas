<script lang="ts">
  import { page } from "$app/stores";
  import topics from "../data/content";
  import RightChevron from "./RightChevron.svelte";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
</script>

<h2 class="tw-text-3xl tw-mb-5">Topics</h2>

<div class="tw-flex tw-flex-wrap tw-gap-x-8 tw-gap-y-4">
  {#each topics as topic}
    <a
      class="tw-flex-none tw-w-72 tw-flex-grow-[1] tw-pt-2.5 tw-border-t-[1px] tw-border-t-slate-300 tw-group"
      href={buildHyperlink($page.url, {
        topic: topic.slug,
      })}
    >
      <div class="tw-flex tw-justify-between">
        <div class="tw-text-xl tw-hyperlink">{topic.name}</div>
        <RightChevron />
      </div>
      <div class="tw-pr-10 tw-mt-1 ">{topic.desc}</div>
    </a>
  {/each}
</div>
