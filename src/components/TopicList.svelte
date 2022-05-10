<script lang="ts">
  import { page } from "$app/stores";
  import topics from "../data/content";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  import RightChevron from "./RightChevron.svelte";
</script>

<div>
  <div class="flex flex-wrap gap-x-8 gap-y-4">
    {#each topics as topic}
      <a
        class="flex-none w-56 flex-grow-[1] pb-4 border-b-[1px] border-b-slate-300 group"
        href={buildHyperlink($page.url, {
          topic: topic.slug,
        })}
      >
        <div class="flex justify-between">
          <div class="text-xl hyperlink">{topic.name}</div>
          <RightChevron />
        </div>
        <div class="pr-10 mt-1 ">{topic.desc}</div>
      </a>
    {/each}
  </div>
</div>
