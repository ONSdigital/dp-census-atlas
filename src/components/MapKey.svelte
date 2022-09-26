<script lang="ts">
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
  <div class={`flex absolute right-[28px] top-20 w-28`}>
    <div
      class="z-abovemap bg-white px-2 pt-2 flex
    flex-col ons-u-fs-s"
    >
      <p class="mb-2 text-base">
        <!-- TODO: Mobile this text is hidden -->
        {$vizStore.params.category.name}
      </p>
      <div class="text-onswhite w-28 p-1 pl-1.5 mb-1" style={`background-color: ${choroplethColours[4]};`}>High</div>
      {#each choroplethColours.slice().reverse() as colour, i}
        <div class="w-28 p-1.5 {i < 2 ? 'text-onswhite' : null}" style={`background-color: ${colour};`}>
          {#if !collapse}{buckets[i]}{/if}
        </div>
      {/each}
      <div class="w-28 p-1 pl-1.5 mt-1" style={`background-color: ${choroplethColours[0]};`}>Low</div>
      <div class={`flex justify-end mt-3 ${collapse ? "mb-1" : "-mr-2"}`}>
        {#if collapse}
          <Icon type="info" onClick={() => (collapse = !collapse)} />
        {:else}
          <Button label={$_("mapKey.button")} icon="chevron-up" onClick={() => (collapse = !collapse)} />
        {/if}
      </div>
    </div>
  </div>
{/if}
