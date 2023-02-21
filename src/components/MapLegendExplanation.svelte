<script lang="ts">
  import type { Mode } from "../types";
  import Icon from "./MaterialIcon.svelte";

  export let mode: Mode;
  export let classificationCode: string;
</script>

{#if mode === "change"}
  <div class="text-xs xs:text-sm pt-0.5 xs:pt-2.5">
    {#if classificationCode === "population_density"}
      Percentage change in people per square kilometres
    {:else if classificationCode === "median_age"}
      Change in median age
    {:else}
      Change in
      <a href="https://en.wikipedia.org/wiki/Percentage_point" class="hyperlink-subdued mr-1">percentage points (pp)</a
      ><span class="inline" aria-hidden="true">
        <Icon kind="openInNew" />
      </span>
    {/if}
    between March 2011 and March 2021 census.
  </div>
{/if}
