<script lang="ts">
  import { vizStore } from "../stores/stores";
  import { choroplethColours } from "../helpers/choroplethHelpers";
</script>

{#if $vizStore}
  <div class={`tw-flex tw-justify-center tw-absolute tw-bottom-8 tw-left-1/2 -tw-translate-x-1/2`}>
    <div
      class="tw-z-abovemap tw-bg-white tw-px-8 tw-pb-2.5 tw-pt-3.5 tw-border-[1px] tw-border-slate-500 tw-flex tw-flex-col tw-gap-1.5 tw-items-center"
    >
      <div class="tw-flex tw-items-center tw-gap-1">
        <div class="tw-text-sm tw-mr-1">Low</div>
        {#each choroplethColours as colour}
          <div class="tw-h-6 tw-w-6" style={`background-color: ${colour};`} />
        {/each}
        <div class="tw-text-sm tw-ml-1">High</div>
      </div>
      <div class="tw-text-center">
        Proportion of {$vizStore.params.variable.units.toLowerCase()}
        with {$vizStore.params.category.name}
        {$vizStore.params.variable.name}.
      </div>
    </div>
  </div>
{/if}
