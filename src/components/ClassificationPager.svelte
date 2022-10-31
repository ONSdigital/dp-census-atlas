<script lang="ts">
  import { params } from "../stores/params";
  import { page } from "$app/stores";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  $: classifications = $params.variable.classifications;
  $: indexOfCurrent = classifications.indexOf($params.classification);
  $: next = classifications.length > indexOfCurrent + 1 ? classifications[indexOfCurrent + 1] : undefined;
  $: prev = indexOfCurrent > 0 ? classifications[indexOfCurrent - 1] : undefined;
  $: allPrev = classifications.slice(0, indexOfCurrent);
  $: allNext = classifications.slice(indexOfCurrent + 1);
</script>

<div class="flex gap-3">
  <div class="flex gap-3 ">
    {#if prev}
      <div class="flex items-center gap-2">
        <span> &lt; </span>
        <a
          class="hyperlink-without-group-hover "
          href={buildHyperlink($page.url, {
            variableGroup: $params.variableGroup.slug,
            variable: $params.variable.slug,
            category: {
              classification: prev.slug,
              category: prev.categories[0].slug,
            },
          })}
          >Less detail
        </a>
      </div>
    {/if}
    {#each allPrev as c}
      <a
        class={`hyperlink-without-group-hover ${c === prev ? "group-hover:decoration-[3px]" : ""}  `}
        href={buildHyperlink($page.url, {
          variableGroup: $params.variableGroup.slug,
          variable: $params.variable.slug,
          category: {
            classification: c.slug,
            category: c.categories[0].slug,
          },
        })}
        aria-label={c.categories.length + " categories"}
        >{c.categories.length}
      </a>
    {/each}
  </div>
  <div class="" aria-label={$params.classification.categories.length + " categories"}>
    {$params.classification.categories.length}
  </div>
  <div class="flex gap-3">
    {#each allNext as c}
      <a
        class={`hyperlink-without-group-hover ${c === next ? "group-hover:decoration-[3px]" : ""}  `}
        href={buildHyperlink($page.url, {
          variableGroup: $params.variableGroup.slug,
          variable: $params.variable.slug,
          category: {
            classification: c.slug,
            category: c.categories[0].slug,
          },
        })}
        aria-label={c.categories.length + " categories"}
        >{c.categories.length}
      </a>
    {/each}
    {#if next}
      <div class="flex items-center gap-2">
        <a
          class="hyperlink-without-group-hover group-hover:decoration-[3px]"
          href={buildHyperlink($page.url, {
            variableGroup: $params.variableGroup.slug,
            variable: $params.variable.slug,
            category: {
              classification: next.slug,
              category: next.categories[0].slug,
            },
          })}
          >More detail
        </a>
        <span> &gt; </span>
      </div>
    {/if}
  </div>
</div>
