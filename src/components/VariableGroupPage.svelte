<script lang="ts">
  import { page } from "$app/stores";
  import { params } from "../stores/params";
  import { nav } from "../stores/nav";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  import { getDefaultChoroplethClassification } from "../helpers/variableHelpers";
  import AreaPanel from "./AreaPanel.svelte";
</script>

<div class="px-6 mb-6">
  <AreaPanel />
  <div class="pt-3 flex">
    <div class="font-bold text-slate-500">Topic</div>
  </div>
  <div class="flex items-center gap-2 text-xl">
    <a class="hyperlink" href={buildHyperlink($page.url)}>Home</a>
    <div class="text-sm font-extrabold text-slate-500 select-none">&gt;</div>
    <div class=" ">{$params.variableGroup.name}</div>
  </div>
  <div class="mt-4 mb-2 ">
    {$params.variableGroup.desc}
  </div>
  <div class="flex flex-col mb-6 last:border-b-[1px] border-b-slate-300">
    {#each $params.variableGroup.variables as variable}
      <a
        class="border-t-[1px] border-t-slate-300 py-2 group custom-ring"
        href={buildHyperlink($page.url, {
          variableGroup: $params.variableGroup.slug,
          variable: variable.slug,
          category: {
            classification: getDefaultChoroplethClassification(variable).slug,
            category: getDefaultChoroplethClassification(variable).categories[0].slug,
          },
        })}
        on:click={() => nav.set({ open: true })}
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

<div class="grow" />
