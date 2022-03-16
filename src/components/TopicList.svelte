
<script lang="ts">

  import { page } from '$app/stores';

  import topics from '../data/curation';
  import RightChevron from './RightChevron.svelte';

  $: url = $page.url;

</script>

<h2 class="text-3xl mb-5">Topics</h2>

<div class="flex flex-wrap gap-x-8 gap-y-4">
  {#each topics as topic}
    <a class="flex-none w-72 flex-grow-[1] pt-2.5 border-t-[1px] border-t-slate-300 group"
      href={`/2021/${topic.slug}${url.search}`}>
      <div class="flex justify-between">
        <div class="text-xl hyperlink" >{topic.name}</div>
        <RightChevron />
      </div>
      <div class="pr-10 mt-1 ">{topic.desc}</div>
    </a>
  {/each}
</div>
