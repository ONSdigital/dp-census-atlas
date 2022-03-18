<script lang="ts">
  import { page } from "$app/stores";
  import RightChevron from "./RightChevron.svelte";
  import topics from "../data/content";

  $: url = $page.url;
  $: topicSlug = $page.params.topic;
  $: topic = topics.find((t) => t.slug === topicSlug);
</script>

<div class="p-6 bg-onspale mb-6">
  <a class="hyperlink" href={`/${url.search}`}>Home</a>
  <span class="hidden xl:inline">
    <span class="mx-1">&gt;</span>
    {topic.name}
  </span>
</div>

<div class="px-6">
  <h1 class="text-3xl mb-0.5">{topic.name}</h1>
  <div class="mb-6">
    {topic.desc}
  </div>
  <div class="flex flex-col mb-6 last:border-b-[1px] border-b-slate-300">
    {#each topic.variables as variable}
      <a
        class="border-t-[1px] border-t-slate-300 py-2 group"
        href={`/2021/${topic.slug}/${variable.slug}/default/${variable.categories[0].slug}${url.search}`}
      >
        <div class="flex justify-between">
          <div class="text-xl hyperlink">{variable.name}</div>
          <RightChevron />
        </div>
        <div class="">{variable.desc}</div>
      </a>
    {/each}
  </div>
</div>

<!--
<div class="p-6 font-mono text-sm bg-onspale">
  This is the [topic] page
</div>
-->
