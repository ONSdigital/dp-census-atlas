<script lang="ts">
  import { viz } from "../stores/viz";
  import type { Mode } from "../types";
  import Icon from "./MaterialIcon.svelte";

  export let mode: Mode;
  export let classificationCode: string;
</script>

{#if mode === "change"}
  <div class="text-xs xs:text-sm pt-0.5 xs:pt-2.5">
    {#if classificationCode === "population_density"}
      Percentage change in people per square kilometres between 2011 and 2021 census.
    {:else if classificationCode === "median_age"}
      Change in median age between 2011 and 2021 census.
    {:else}
      Change in
      <a
        href="https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates/articles/censusmaps/2022-11-02#:~:text=Changes%20over%20time"
        class="hyperlink-subdued mr-1">percentage points (pp)</a
      ><span class="inline" aria-hidden="true">
        <Icon kind="openInNew" />
      </span>
      for {$viz.params.variable.units}
      between 2011 and 2021 census.
    {/if}
  </div>
{/if}
