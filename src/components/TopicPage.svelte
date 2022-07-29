<script lang="ts">
  import { page } from "$app/stores";
  import { _ } from "svelte-i18n";

  // import { mapStore, selectedGeographyStore, vizStore } from "../stores/stores";
  // import { setVizStore } from "../data/setVizStore";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  import { topicStore } from "../stores/stores"

  import Heading from "./Heading.svelte";
  import AreaPanel from "./AreaPanel.svelte";

  $: topicSlug = $page.params.topic;
  $: topic = $topicStore.find((t) => t.slug === topicSlug);
  
  // $: if ($mapStore) {
  //   vizStore.set(undefined);
  // }
</script>

<Heading />

<!-- {JSON.stringify($vizStore)} -->
<div class="px-6">
  <AreaPanel />
  <div class="pt-3 flex">
    <div class="font-bold text-slate-500">Topic</div>
  </div>
  <div class="flex items-center gap-2 text-xl">
    <a class="hyperlink" href={buildHyperlink($page.url)}>Home</a>
    <div class="text-sm font-extrabold text-slate-500">&gt;</div>
    <div class=" ">{topic.name}</div>
  </div>
  <div class="mt-4 mb-2 ">
    {topic.desc}
  </div>
  <div class="flex flex-col mb-6 last:border-b-[1px] border-b-slate-300">
    {#each topic.variables as variable}
      <a
        class="border-t-[1px] border-t-slate-300 py-2 group"
        href={buildHyperlink($page.url, {
          topic: topic.slug,
          variable: variable.slug,
          category: variable.categories[0].slug,
        })}
      >
        <div class="flex justify-between">
          <div class="hyperlink">{variable.name}</div>
          <div class="text-onsblue stroke-2 group-hover:stroke-[2px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        <div class="">{variable.desc}</div>
      </a>
    {/each}
  </div>
</div>
