<script lang="ts">
  import { params } from "../stores/params";
  import { page } from "$app/stores";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  import { getFirstCategoryInClassificationForMode } from "../helpers/contentHelpers";
  $: classifications = $params.variable.classifications;
  $: indexOfCurrent = classifications.indexOf($params.classification);
  $: next = classifications.length > indexOfCurrent + 1 ? classifications[indexOfCurrent + 1] : undefined;
  $: prev = indexOfCurrent > 0 ? classifications[indexOfCurrent - 1] : undefined;
</script>

<div class="flex gap-3 mb-8">
  {#if prev}
    <div class="flex items-center gap-1.5 whitespace-nowrap">
      <span class="select-none"> &lt; </span>
      <a
        class="hyperlink-without-group-hover "
        href={buildHyperlink($page.url, {
          mode: $params.mode,
          variableGroup: $params.variableGroup.slug,
          variable: $params.variable.slug,
          category: {
            classification: prev.slug,
            category: getFirstCategoryInClassificationForMode(prev, $params.mode).slug,
          },
        })}
        >Fewer categories
      </a>
    </div>
  {/if}
  {#if next}
    <div class="flex items-center gap-1.5 whitespace-nowrap">
      <a
        class="hyperlink-without-group-hover group-hover:decoration-[3px]"
        href={buildHyperlink($page.url, {
          mode: $params.mode,
          variableGroup: $params.variableGroup.slug,
          variable: $params.variable.slug,
          category: {
            classification: next.slug,
            category: getFirstCategoryInClassificationForMode(next, $params.mode).slug,
          },
        })}
        >More categories
      </a>
      <span class="select-none"> &gt; </span>
    </div>
  {/if}
</div>
