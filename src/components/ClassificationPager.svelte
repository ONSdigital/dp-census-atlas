<script lang="ts">
  import { params } from "../stores/params";
  import { page } from "$app/stores";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  $: classifications = $params.variable.classifications;
  $: indexOfCurrent = classifications.indexOf($params.classification);
  $: next = classifications.length > indexOfCurrent + 1 ? classifications[indexOfCurrent + 1] : undefined;
  $: prev = indexOfCurrent > 0 ? classifications[indexOfCurrent - 1] : undefined;
</script>

<div class="flex gap-3 mb-6">
  {#if prev}
    <div class="flex items-center gap-1.5">
      <span class="select-none"> &lt; </span>
      <a
        class="hyperlink-without-group-hover "
        href={buildHyperlink($page.url, {
          variableGroup: $params.variableGroup.slug,
          variable: $params.variable.slug,
          category: {
            classification: prev.slug,
            category: prev.categories[0].slug,
          },
          ...($params?.changeOverTime && { changeOverTime: $params.changeOverTime }),
        })}
        >Fewer categories
      </a>
    </div>
  {/if}
  {#if next}
    <div class="flex items-center gap-1.5">
      <a
        class="hyperlink-without-group-hover group-hover:decoration-[3px]"
        href={buildHyperlink($page.url, {
          variableGroup: $params.variableGroup.slug,
          variable: $params.variable.slug,
          category: {
            classification: next.slug,
            category: next.categories[0].slug,
          },
          ...($params?.changeOverTime && { changeOverTime: $params.changeOverTime }),
        })}
        >More categories
      </a>
      <span class="select-none"> &gt; </span>
    </div>
  {/if}
</div>
