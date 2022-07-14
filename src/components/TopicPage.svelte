<script lang="ts">
  import { page } from "$app/stores";
  import { _ } from "svelte-i18n";

  import { selectedGeographyStore } from "../stores/stores";
  import { returnCorrectArticle, unCapitalizeFirstLetter } from "../util/stringUtil";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  import { getDefaultClassification } from "../helpers/variableHelpers";
  import topics from "../data/content.json";

  import ONSAccordion from "./ons/ONSAccordion.svelte";
  import ONSAccordionPanel from "./ons/ONSAccordionPanel.svelte";
  import SearchHeader from "./SearchHeader.svelte";
  import Heading from "./Heading.svelte";
  import Explore from "./Explore.svelte";
  import AreaPanel from "./AreaPanel.svelte";
  import RightChevron from "./RightChevron.svelte";
  import IntroAndExamples from "./IntroAndExamples.svelte";
  import Breadcrumb from "./Breadcrumb.svelte";

  let changeLocation: boolean = false;

  $: topicSlug = $page.params.topic;
  $: topic = topics.find((t) => t.slug === topicSlug);
  $: selectedGeographyDisplayName = $selectedGeographyStore?.displayName;
</script>

<Heading />

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
          category: getDefaultClassification(variable).categories[0].slug,
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
