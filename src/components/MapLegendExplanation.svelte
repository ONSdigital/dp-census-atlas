<script lang="ts">
  import { viz } from "../stores/viz";
  import type { Mode } from "../types";
  import Icon from "./MaterialIcon.svelte";

  export let mode: Mode;
  export let classificationCode: string;
  export let variableName: string;
</script>

{#if mode === "change"}
  <div class="text-xs xs:text-sm pt-0.5 xs:pt-2.5">
    {#if classificationCode === "population_density"}
      Percentage change in persons per square kilometre between 2011 and 2021 census.
    {:else if classificationCode === "median_age"}
      Change in median age between 2011 and 2021 census.
    {:else}
      {variableName}: change in
      <a
        href="https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates/articles/censusmaps/2022-11-02#:~:text=A%20percentage%20point%20change%20is%20the%20difference%20between%20percentages"
        class="hyperlink-subdued">percentage points (pp)</a
      >
      for {$viz.params.variable.units} between 2011 and 2021 census.
    {/if}
  </div>
{/if}
