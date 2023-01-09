<script lang="ts">
  import { page } from "$app/stores";
  import { params } from "../stores/params";
  import { nav } from "../stores/nav";
  import { gotoUrl } from "../helpers/navigationHelper";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  import CategoryPageLinks from "./CategoryPageLinks.svelte";
  import AreaPanel from "./AreaPanel.svelte";
  import RadioButton from "./RadioButton.svelte";
  import VariableDescription from "./VariableDescription.svelte";
  import ClassificationPager from "./ClassificationPager.svelte";
  import CaveatWarning from "./CaveatWarning.svelte";
</script>

<div class="grow flex flex-col">
  <div class="px-6 border-t-[1px] border-t-ons-grey-15">
    <AreaPanel />
    <section class="mb-8">
      <h2 class="pt-3 font-bold text-slate-500">Topic</h2>
      <nav class="flex flex-wrap items-center gap-2 text-xl" aria-label="Breadcrumb">
        <a class="hyperlink" href={buildHyperlink($page.url)}>Home</a>
        <div class="text-sm font-extrabold text-ons-grey-75 select-none" aria-hidden>&gt;</div>
        <a class="hyperlink" href={buildHyperlink($page.url, { variableGroup: $params.variableGroup.slug })}
          >{$params.variableGroup.name}</a
        >
        <div class="text-sm font-extrabold text-ons-grey-75 select-none" aria-hidden>&gt;</div>
        <div class="">{$params.variable.name}</div>
      </nav>
      {#if $params.variable.caveat_text}
        <CaveatWarning text={$params.variable.caveat_text} link={$params.variable.caveat_link} />
      {/if}
      <div class="mt-4 mb-2">
        <VariableDescription shortDescription={$params.variable.desc} longDescription={$params.variable.long_desc} />
      </div>
      <ul class="flex flex-col last:border-b-[1px] mb-4">
        {#each $params.classification.categories as category}
          <li class="">
            <a
              href={buildHyperlink($page.url, {
                variableGroup: $params.variableGroup.slug,
                variable: $params.variable.slug,
                category: {
                  classification: $params.classification.slug,
                  category: category.slug,
                },
              })}
              on:click|preventDefault={() => {
                // use gotoUrl (with keepfocus: true) for better keyboard navigation
                const link = buildHyperlink($page.url, {
                  variableGroup: $params.variableGroup.slug,
                  variable: $params.variable.slug,
                  category: {
                    classification: $params.classification.slug,
                    category: category.slug,
                  },
                });
                nav.set({ open: false });
                gotoUrl(link);
              }}
              class="flex gap-2 items-center p-2 border-t-[1px] border-t-slate-300 cursor-pointer custom-ring"
              class:bg-ons-grey-5={category === $params.category}
            >
              <RadioButton selected={category === $params.category} />
              <div>{category.name}</div>
            </a>
          </li>
        {/each}
      </ul>
      {#if $params.variable.classifications.length > 1}
        <ClassificationPager />
      {/if}
    </section>
  </div>
  <div class="grow" />
  <div class="p-6 pt-4 bg-ons-grey-5 border-t-ons-grey-15 border-t-[1px]">
    <CategoryPageLinks dataDownloadUrl={$params.classification.data_download} />
  </div>
</div>
