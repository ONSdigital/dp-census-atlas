<script lang="ts">
  import Badge from "./Badge.svelte";
  import SearchBoxItem from "./SearchBoxItem.svelte";
  import { highlightText, searchCensus } from "../helpers/searchCensusHelper";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  import { page } from "$app/stores";

  export let name: string;
  let val = "";
  $: results = searchCensus(val);
</script>

<div class="">
  <div class="tw-flex tw-max-w-[30rem]">
    <input
      id="{name}-input"
      {name}
      type="search"
      autocomplete="off"
      class="tw-flex tw-items-center tw-justify-center tw-h-12 tw-p-2 tw-w-full tw-border-l-2 tw-border-t-2 tw-border-b-2 tw-border-black focus:tw-border-4 tw-custom-ring"
      bind:value={val}
    />
    <button tabindex="-1" type="submit" class="tw-bg-onsblue tw-px-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="tw-h-6 tw-w-6 tw-text-white "
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
    <div class="tw-relative">
      <div
        class="tw-absolute tw-left-0 tw-right-0 tw-z-50 tw-max-h-[30rem] tw-overflow-y-auto tw-p-3 tw-pt-2 tw-border-[1px] tw-border-slate-600 tw-bg-white"
      >
        <ul>
          {#each results.topics as t}
            <SearchBoxItem link={buildHyperlink($page.url, { topic: t.slug })}>
              <div class="tw-flex tw-items-center tw-gap-2">
                <Badge className="tw-bg-slate-500">TOPIC</Badge>
                <div class="tw-text-xl">{@html highlightText(t.name, val)}</div>
              </div>
              <div class="">
                {@html highlightText(t.desc, val)}
              </div>
            </SearchBoxItem>
          {/each}
          {#each results.variables as v}
            <SearchBoxItem
              link={buildHyperlink($page.url, {
                topic: v.topic.slug,
                variable: v.variable.slug,
              })}
            >
              <div class="tw-flex tw-items-center tw-gap-2">
                <Badge className="tw-bg-slate-500">VARIABLE</Badge>
                <div class="tw-text-xl">{@html highlightText(v.variable.name, val)}</div>
              </div>
              <div class="">
                {@html highlightText(v.variable.desc, val)}
              </div>
            </SearchBoxItem>
          {/each}
          {#each results.categories as c}
            <SearchBoxItem
              link={buildHyperlink($page.url, {
                topic: c.topic.slug,
                variable: c.variable.variable.slug,
                category: c.category.slug,
              })}
            >
              <div class="tw-flex tw-items-center tw-gap-2">
                <Badge className="tw-bg-slate-500">CATEGORY</Badge>
                <div class="tw-text-xl">{@html highlightText(c.category.name, val)}</div>
              </div>
              <div class="">
                in variable {c.variable.variable.name}
              </div>
            </SearchBoxItem>
          {/each}
        </ul>
        <div class="tw-pt-3 tw-pb-1 tw-px-1">
          {results.topics.length + results.variables.length + results.categories.length}
          results
        </div>
      </div>
    </div>
  {/if}
</div>
