<script lang="ts">
  import { page } from "$app/stores";
  import Badge from "./Badge.svelte";
  import SearchBoxItem from "./SearchBoxItem.svelte";
  import { highlightText, searchCensus } from "../helpers/searchCensusHelper";
  import { content } from "../stores/content";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";

  export let name: string;
  let val = "";
  $: results = searchCensus(val, $content.variableGroups);
</script>

<div class="">
  <div class="flex max-w-[30rem]">
    <input
      id="{name}-input"
      {name}
      type="search"
      placeholder="Search Census 2021"
      autocomplete="off"
      class="flex items-center justify-center h-12 p-2 w-full appearance-none border-l-2 border-t-2 border-b-2 border-black rounded-none bg-ons-white focus:border-4 custom-ring"
      bind:value={val}
    />
    <button tabindex="-1" type="submit" class="bg-onsblue px-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 text-white "
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="3"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </button>
  </div>

  {#if val && val.length > 2}
    <div class="relative">
      <div
        class="absolute left-0 right-0 z-50 max-h-[30rem] overflow-y-auto p-3 pt-2 border-[1px] border-slate-600 bg-white"
      >
        <ul>
          {#each results.variableGroups as vg}
            <SearchBoxItem
              link={buildHyperlink($page.url, {
                variableGroup: vg.slug,
              })}
            >
              <div class="">
                <Badge className="bg-slate-500 inline mr-1">TOPIC</Badge>
                <div class="text-lg inline">{@html highlightText(vg.name, val)}</div>
              </div>
              <div class="mt-0.5">
                {@html highlightText(vg.desc, val)}
              </div>
            </SearchBoxItem>
          {/each}
          {#each results.variables as v}
            <SearchBoxItem
              link={buildHyperlink($page.url, {
                variableGroup: v.variableGroup.slug,
                variable: v.variable.slug,
                category: {
                  classification: v.variable.classifications.find((c) => c.choropleth_default).slug,
                  category: v.variable.classifications.find((c) => c.choropleth_default).categories[0].slug,
                },
              })}
            >
              <div class="">
                <Badge className="bg-slate-500 inline mr-1">VARIABLE</Badge>
                <div class="text-lg inline">{@html highlightText(v.variable.name, val)}</div>
              </div>
              <div class="mt-0.5">
                {@html highlightText(v.variable.desc, val)}
              </div>
            </SearchBoxItem>
          {/each}
          {#each results.categories as c}
            <SearchBoxItem
              link={buildHyperlink($page.url, {
                variableGroup: c.variableGroup.slug,
                variable: c.variable.variable.slug,
                category: {
                  classification: c.classification.classification.slug,
                  category: c.category.slug,
                },
              })}
            >
              <div class="">
                <Badge className="bg-slate-500 inline mr-1">CATEGORY</Badge>
                <div class="text-lg inline">{@html highlightText(c.category.name, val)}</div>
              </div>
              <div class="mt-0.5">
                in variable {c.variable.variable.name}
              </div>
            </SearchBoxItem>
          {/each}
        </ul>
        <div class="pt-3 pb-1 px-1">
          {results.variableGroups.length + results.variables.length + results.categories.length}
          results
        </div>
      </div>
    </div>
  {/if}
</div>
