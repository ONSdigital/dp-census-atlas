<script lang="ts">
  import { vizStore } from "../stores/stores";
  import { choroplethColours } from "../helpers/choroplethHelpers";
  import { calculateDataBreakBuckets } from "../helpers/mapKeyHelper";
  const buckets = calculateDataBreakBuckets([4.11, 6.4587, 19.23423, 80.3434, 90], 2.013);
</script>

{#if $vizStore}
  <div class={`tw-flex tw-justify-center tw-absolute tw-bottom-8 tw-left-1/2 -tw-translate-x-1/2`}>
    <div
      class="tw-z-abovemap tw-bg-white tw-px-8 tw-pb-2.5 tw-pt-3.5 tw-border-[1px] tw-border-slate-500 tw-flex tw-flex-col tw-gap-1.5 tw-items-center"
    >
      <div class="tw-text-center">
        {$vizStore.params.category.name}
      </div>
      <div class="tw-text-sm tw-mr-1">High</div>
      {#each choroplethColours.reverse() as colour, i}
        <div style={`background-color: ${colour};`}>
          {buckets[i]}
        </div>
      {/each}
      <div class="tw-text-sm tw-ml-1">Low</div>
    </div>
  </div>
{/if}
