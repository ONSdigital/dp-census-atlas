<script lang="ts">
  import { page } from "$app/stores";
  import type { Category } from "../types";
  import { params } from "../stores/params";
  import { nav } from "../stores/nav";
  import { gotoUrl } from "../helpers/navigationHelper";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  import CategoryPageLinks from "./CategoryPageLinks.svelte";
  import AreaPanel from "./AreaPanel.svelte";
  import ModePanel from "./ModePanel.svelte";
  import RadioButton from "./RadioButton.svelte";
  import VariableDescription from "./VariableDescription.svelte";
  import ClassificationPager from "./ClassificationPager.svelte";
  import CaveatWarning from "./CaveatWarning.svelte";
  import OtherModeLinks from "./OtherModeLinks.svelte";
  import { never } from "../util/typeUtil";

  const buildCategoryLink = (category: Category) => {
    return buildHyperlink($page.url, {
      mode: $params.mode,
      variableGroup: $params.variableGroup.slug,
      variable: $params.variable.slug,
      category: {
        classification: $params.classification.slug,
        category: category.slug,
      },
    });
  };

  const getDownloadUrl = () => {
    switch ($params.mode) {
      case "choropleth":
        return $params.classification.data_download;
      case "change":
        return $params.classification.change_data_download;
      default:
        never($params.mode);
    }
  };
</script>

<div class="grow flex flex-col mb-6">
  <div class="px-6">
    <AreaPanel />
    <ModePanel />
    <section class="mb-8">
      <h2 class="pt-3 font-bold text-slate-500">Topic</h2>
      <nav class="flex flex-wrap items-center gap-2 text-xl" aria-label="Breadcrumb">
        <a class="hyperlink" href={buildHyperlink($page.url, { mode: $params.mode })}>Home</a>
        <div class="text-sm font-extrabold text-ons-grey-75 select-none" aria-hidden>&gt;</div>
        <a
          class="hyperlink"
          href={buildHyperlink($page.url, { mode: $params.mode, variableGroup: $params.variableGroup.slug })}
          >{$params.variableGroup.name}</a
        >
        <div class="text-sm font-extrabold text-ons-grey-75 select-none" aria-hidden>&gt;</div>
        <div class="">{$params.variable.name}</div>
      </nav>
      {#if $params.variable.caveat_text}
        <CaveatWarning text={$params.variable.caveat_text} link={$params.variable.caveat_link} />
      {/if}
      {#if $params.classification.change_notes && $params.mode === "change"}
        <CaveatWarning text={$params.classification.change_notes} link={$params.classification.change_notes_link} />
      {/if}
      <div class="mt-4 mb-2">
        <VariableDescription shortDescription={$params.variable.desc} longDescription={$params.variable.long_desc} />
      </div>
      <ul class="flex flex-col last:border-b-[1px] mb-4">
        {#each $params.classification.categories as category}
          {@const link = buildCategoryLink(category)}
          <li class="">
            <a
              href={link}
              on:click|preventDefault={() => {
                nav.set({ open: false });
                gotoUrl(link); // use gotoUrl (with keepFocus: true) for better keyboard navigation
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
</div>

<div class="grow" />

<CategoryPageLinks dataDownloadUrl={getDownloadUrl()} />
