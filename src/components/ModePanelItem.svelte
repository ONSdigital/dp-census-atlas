<script lang="ts">
  import { page } from "$app/stores";
  import { modeInfo } from "../helpers/modeHelpers";
  import { params } from "../stores/params";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  import {
    getAvailableModesForClassification,
    getBestMatchingCategoryInClassificationForMode,
  } from "../helpers/contentHelpers";
  import type { Mode } from "../types";
  import { nav } from "../stores/nav";

  export let mode: Mode;
  export let toggleOpen: () => void;

  $: disabled = $params.category && !getAvailableModesForClassification($params.variable, $params.classification)[mode];
</script>

<li class="ml-4">
  {#if disabled}
    <div class="">
      <div class="text-xl text-ons-grey-75">{modeInfo[mode].name}</div>
      <div class="">{modeInfo[mode].desc}</div>
    </div>
  {:else}
    <a
      class="group custom-ring block"
      class:bg-red-500={disabled}
      on:click={() => {
        toggleOpen();
        nav.set({ open: false });
      }}
      href={buildHyperlink($page.url, {
        mode: mode,
        ...($params.variableGroup && { variableGroup: $params.variableGroup.slug }),
        ...($params.variable && { variable: $params.variable.slug }),
        ...($params.category && {
          category: {
            classification: $params.classification.slug,
            category: getBestMatchingCategoryInClassificationForMode($params.category, $params.classification, "change") //TODO!
              .slug,
          },
        }),
      })}
    >
      <div class="">
        <div class="hyperlink text-xl">{modeInfo[mode].name}</div>
        <div class="">{modeInfo[mode].desc}</div>
      </div>
    </a>
  {/if}
</li>
