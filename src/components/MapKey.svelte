<script lang="ts">
  import { vizStore } from "../stores/stores";
  import { choroplethColours } from "../helpers/choroplethHelpers";
  import { calculateDataBreakBuckets } from "../helpers/mapKeyHelper";
  import { areAllDefined } from "../util/genUtil";
  let buckets: string[];
  $: areAllDefined([$vizStore?.breaks]) &&
    (buckets = calculateDataBreakBuckets($vizStore.breaks, $vizStore?.minMaxVals[0]));
</script>

{#if $vizStore}
  <div class={`tw-flex tw-justify-center tw-absolute tw-right-0 tw-top-20`}>
    <div
      class="tw-z-abovemap tw-bg-white tw-px-3 tw-pb-10 tw-pt-3.5 tw-flex
    tw-flex-col tw-items-center ons-u-fs-s"
    >
      <div class="tw-text-center tw-mb-2 tw-w-28 tw-text-[16px]">
        {$vizStore.params.category.name}
      </div>
      <div
        class="tw-text-onswhite tw-w-28 tw-p-1 tw-pl-1.5 tw-mb-1"
        style={`background-color: ${choroplethColours[4]};`}
      >
        High
      </div>
      {#each choroplethColours.slice().reverse() as colour, i}
        <div class="tw-w-28 tw-p-1.5 {i < 2 ? 'tw-text-onswhite' : null}" style={`background-color: ${colour};`}>
          {buckets[i]}
        </div>
      {/each}
      <div class="tw-w-28 tw-p-1  tw-pl-1.5 tw-mt-1" style={`background-color: ${choroplethColours[0]};`}>Low</div>
    </div>
  </div>
{/if}
