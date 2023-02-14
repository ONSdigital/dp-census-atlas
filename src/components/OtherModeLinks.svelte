<script lang="ts">
  import { page } from "$app/stores";
  import { params } from "../stores/params";
  import type { Classification } from "../types";
  import { getAvailableModesForClassification } from "../helpers/contentHelpers";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  import Icon from "./MaterialIcon.svelte";

  export let classification: Classification;
  $: availableModes = getAvailableModesForClassification(classification);
</script>

{#if $params.mode === "choropleth" && availableModes.change}
  <div class="p-3 bg-ons-grey-5 mb-6 flex justify-end">
    <div class=" ">
      <a
        href={buildHyperlink($page.url, {
          mode: "change",
          variableGroup: $params.variableGroup.slug,
          variable: $params.variable.slug,
          category: { classification: $params.classification.slug, category: $params.category.slug },
        })}
        class="flex items-center gap-2.5 custom-ring flex-nowrap whitespace-nowrap group"
      >
        <!-- <div class="fill-ons-census-supporting w-3 h-3">
          <svg id="triangle" viewBox="0 0 100 100">
            <polygon points="50 0, 100 100, 0 100" />
          </svg>
        </div> -->
        <!-- <div class="bg-ons-census-supporting p-0.5 text-lg text-ons-white flex items-center">
        <Icon kind="changeHistory" />
      </div> -->
        <div class="hyperlink">Compare with 2011</div>
      </a>
    </div>
  </div>
{:else if $params.mode === "change" && availableModes.choropleth}
  <div class="p-3 bg-ons-grey-5 mb-6 flex justify-end">
    <a
      class="hyperlink"
      href={buildHyperlink($page.url, {
        mode: "choropleth",
        variableGroup: $params.variableGroup.slug,
        variable: $params.variable.slug,
        category: { classification: $params.classification.slug, category: $params.category.slug },
      })}>See Census 2021 results</a
    >
  </div>
{/if}

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
