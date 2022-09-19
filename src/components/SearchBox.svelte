<script lang="ts">
  import Badge from "./Badge.svelte";
  import SearchBoxItem from "./SearchBoxItem.svelte";
  import { highlightText, searchCensus } from "../helpers/searchCensusHelper";
  import { contentStore } from "../stores/stores";

  export let name: string;
  let val = "";
  $: results = searchCensus(val, $contentStore.variableGroups);
</script>

<div class="">
  <div class="flex max-w-[30rem]">
    <input
      id="{name}-input"
      {name}
      type="search"
      placeholder="Search Census"
      autocomplete="off"
      class="flex items-center justify-center h-12 p-2 w-full border-l-2 border-t-2 border-b-2 border-black focus:border-4 custom-ring"
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
            <SearchBoxItem link={`/univariate/${vg.slug}`}>
              <div class="flex items-center gap-2">
                <Badge className="bg-slate-500">TOPIC</Badge>
                <div class="text-xl">{@html highlightText(vg.name, val)}</div>
              </div>
              <div class="">
                {@html highlightText(vg.desc, val)}
              </div>
            </SearchBoxItem>
          {/each}
          {#each results.variables as v}
            <SearchBoxItem link={`/univariate/${v.variableGroup.slug}/${v.variable.slug}`}>
              <div class="flex items-center gap-2">
                <Badge className="bg-slate-500">VARIABLE</Badge>
                <div class="text-xl">{@html highlightText(v.variable.name, val)}</div>
              </div>
              <div class="">
                {@html highlightText(v.variable.desc, val)}
              </div>
            </SearchBoxItem>
          {/each}
          {#each results.categories as c}
            <SearchBoxItem
              link={`/univariate/${c.variableGroup.slug}/${c.variable.variable.slug}/default/${c.category.slug}`}
            >
              <div class="flex items-center gap-2">
                <Badge className="bg-slate-500">CATEGORY</Badge>
                <div class="text-xl">{@html highlightText(c.category.name, val)}</div>
              </div>
              <div class="">
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
