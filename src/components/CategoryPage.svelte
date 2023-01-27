<script lang="ts">
  import { page } from "$app/stores";
  import type { Category } from "../types";
  import { params } from "../stores/params";
  import { nav } from "../stores/nav";
  import { gotoUrl } from "../helpers/navigationHelper";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  import Icon from "./MaterialIcon.svelte";
  import CategoryPageLinks from "./CategoryPageLinks.svelte";
  import AreaPanel from "./AreaPanel.svelte";
  import RadioButton from "./RadioButton.svelte";
  import VariableDescription from "./VariableDescription.svelte";
  import ClassificationPager from "./ClassificationPager.svelte";
  import CaveatWarning from "./CaveatWarning.svelte";
  import ChangeOverTimeToggle from "./ChangeOverTimeToggle.svelte";

  const buildCategoryLink = (category: Category) => {
    return buildHyperlink($page.url, {
      mapType: $params.mapType,
      variableGroup: $params.variableGroup.slug,
      variable: $params.variable.slug,
      category: {
        classification: $params.classification.slug,
        category: category.slug,
      },
    });
  };
</script>

<div class="grow flex flex-col mb-6">
  <div class="px-6">
    <AreaPanel />
    <section class="mb-8">
      <h2 class="pt-3 font-bold text-slate-500">Topic</h2>
      <nav class="flex flex-wrap items-center gap-2 text-xl" aria-label="Breadcrumb">
        <a class="hyperlink" href={buildHyperlink($page.url)}>Home</a>
        <div class="text-sm font-extrabold text-ons-grey-75 select-none" aria-hidden>&gt;</div>
        <a
          class="hyperlink"
          href={buildHyperlink($page.url, { mapType: $params.mapType, variableGroup: $params.variableGroup.slug })}
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
      <ChangeOverTimeToggle />

      <!-- work-in-progress -->
      {#if false}
        <div class="mb-6 mt-6 flex justify-end py-3 border-t-[1px] bg-ons-grey-5 px-3 ">
          <div class="  ">
            <a
              href="https://www.ons.gov.uk/feedback"
              class="flex items-center gap-2.5 custom-ring flex-nowrap whitespace-nowrap group"
            >
              <!-- <div class="fill-ons-census-supporting w-3 h-3">
              <svg id="triangle" viewBox="0 0 100 100">
                <polygon points="50 0, 100 100, 0 100" />
              </svg>
            </div> -->
              <div class="bg-ons-census-supporting p-1">
                <div class="text-lg text-ons-white">
                  <Icon kind="changeHistory" />
                </div>
              </div>
              <!-- <div class="text-lg ">
              <Icon kind="changeHistory" />
            </div> -->
              <div class="hyperlink">Compare with 2011</div>
            </a>
          </div>
        </div>
      {/if}
    </section>
  </div>
</div>

<div class="grow" />

<!-- work-in-progress -->
{#if false}
  <div class="mb-6 mx-6 flex justify-end">
    <div class="p-3 bg-ons-grey-5 ">
      <a
        href="https://www.ons.gov.uk/feedback"
        class="flex items-center gap-2.5 custom-ring flex-nowrap whitespace-nowrap group"
      >
        <div class="fill-ons-census-supporting w-3 h-3">
          <svg id="triangle" viewBox="0 0 100 100">
            <polygon points="50 0, 100 100, 0 100" />
          </svg>
        </div>
        <!-- <div class="bg-ons-census-supporting p-0.5 text-lg text-ons-white flex items-center">
        <Icon kind="changeHistory" />
      </div> -->
        <div class="hyperlink">Compare with 2011</div>
      </a>
    </div>
  </div>
{/if}

<CategoryPageLinks dataDownloadUrl={$params.classification.data_download} />
