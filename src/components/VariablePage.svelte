<script lang="ts">
  import { page } from "$app/stores";
  import { params } from "../stores/params";
  import { number2words } from "../util/numberUtil";
  import { capitalizeFirstLetter } from "../util/stringUtil";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  import AreaPanel from "./AreaPanel.svelte";
</script>

<!-- todo: <svelte:head> page title -->

<div class="h-full flex flex-col">
  <div class="px-6 border-t-[1px] border-t-ons-grey-15">
    <AreaPanel />
    <section class="mb-8">
      <h2 class="pt-3 font-bold text-slate-500">Topic</h2>
      <nav class="flex flex-wrap items-center gap-2 text-xl" aria-label="Breadcrumb">
        <a class="hyperlink" href={buildHyperlink($page.url, { mode: $params.mode })}>Home</a>
        <div class="text-sm font-extrabold text-slate-500" aria-hidden>&gt;</div>
        <a
          class="hyperlink"
          href={buildHyperlink($page.url, { mode: $params.mode, variableGroup: $params.variableGroup.slug })}
          >{$params.variableGroup.name}</a
        >
        <div class="text-sm font-extrabold text-slate-500" aria-hidden>&gt;</div>
        <div class="">{$params.variable.name}</div>
      </nav>
      <div class="mt-4 mb-2">
        This variable is available in {number2words($params.variable.classifications.length)} classifications
      </div>

      <div class="flex flex-col mb-6 last:border-b-[1px] border-b-slate-300">
        {#each $params.variable.classifications as classification}
          <a
            class="border-t-[1px] border-t-slate-300 py-2 group"
            href={buildHyperlink($page.url, {
              mode: $params.mode,
              variableGroup: $params.variableGroup.slug,
              variable: $params.variable.slug,
              category: {
                classification: classification.slug,
                category: classification.categories[0].slug,
              },
            })}
          >
            <div class="flex justify-between">
              <div class="hyperlink">
                {capitalizeFirstLetter(number2words(classification.categories.length))} categories
              </div>
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
            <div class="">
              {$params.variable.name} in {classification.categories.length} categories.
            </div>
          </a>
        {/each}
      </div>
    </section>
  </div>

  {#if $params.variable.classifications.length === 1}
    <div class="px-6">This is the only classification available</div>
  {/if}
</div>
