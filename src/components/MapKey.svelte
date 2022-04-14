<script type="text/javascript" lang="ts">
  import { _ } from "svelte-i18n";
  import { vizStore } from "../stores/stores";
  import { choroplethColours } from "../helpers/choroplethHelpers";
  import { calculateDataBreakBuckets } from "../helpers/mapKeyHelper";
  import { areAllDefined } from "../util/genUtil";
  import Button from "./Button.svelte";
  import Icon from "./Icon.svelte";

  let buckets: string[];
  /* TODO: Mobile this is collapsed as default */
  let collapse: boolean = false;
  $: areAllDefined([$vizStore?.breaks]) &&
    (buckets = calculateDataBreakBuckets($vizStore.breaks, $vizStore?.minMaxVals[0]));
</script>

{#if $vizStore}
  <div class={`tw-flex tw-absolute tw-right-[28px] tw-top-20 tw-w-28`}>
    <div
      class="tw-z-abovemap tw-bg-white tw-px-2 tw-pt-2 tw-flex
    tw-flex-col ons-u-fs-s"
    >
      <p class="tw-mb-2 tw-text-base">
        <!-- TODO: Mobile this text is hidden -->
        {$vizStore.params.category.name}
      </p>
      <div
        class="tw-text-onswhite tw-w-28 tw-p-1 tw-pl-1.5 tw-mb-1"
        style={`background-color: ${choroplethColours[4]};`}
      >
        High
      </div>
      {#each choroplethColours.slice().reverse() as colour, i}
        <div class="tw-w-28 tw-p-1.5 {i < 2 ? 'tw-text-onswhite' : null}" style={`background-color: ${colour};`}>
          {#if !collapse}{buckets[i]}{/if}
        </div>
      {/each}
      <div class="tw-w-28 tw-p-1 tw-pl-1.5 tw-mt-1" style={`background-color: ${choroplethColours[0]};`}>Low</div>
      <div class={`tw-flex tw-justify-end tw-mt-3 ${collapse ? "tw-mb-1" : "tw--mr-2"}`}>
        {#if collapse}
          <Icon type="info" onClick={() => (collapse = !collapse)} />
        {:else}
          <Button label={$_("mapKey.button")} icon="chevron-up" onClick={() => (collapse = !collapse)} />
        {/if}
      </div>
    </div>
  </div>
{/if}
