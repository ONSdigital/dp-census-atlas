<script lang="ts">
  import { roundedClassificationDataToString } from "../helpers/classificationHelpers";
  import type { Mode } from "../types";
  import BreaksMarker from "./BreaksMarker.svelte";

  export let hovered = undefined;
  export let selected = undefined;
  export let breaks = [0, 20, 40, 60, 80, 100];
  export let colors = ["rgba(234,236,177)", "rgba(169,216,145)", "rgba(0,167,186)", "rgba(0,78,166)", "rgba(0,13,84)"];
  export let suffix = "";
  export let snapTicks = true;
  export let mode: Mode = "choropleth";
  export let classificationCode = "";
  export let showPositive = false;

  // handle case of only one breaks value
  $: ticks = breaks.length === 1 ? [breaks[0], breaks[0]] : breaks;

  const pos = (val, breaks) => {
    if (val < breaks[0]) {
      return 0;
    }
    if (val >= breaks[breaks.length - 1]) {
      return 100;
    } else {
      let i = 0;
      while (val > breaks[i + 1]) i += 1;
      let unit = 100 / (breaks.length - 1);
      let offset = (val - breaks[i]) / (breaks[i + 1] - breaks[i]);
      return (i + offset) * unit;
    }
  };

  const getPrefix = (val) => {
    if (showPositive && val > 0) {
      return "+";
    }
    return "";
  };
</script>

<div class="mt-3 box-border relative w-full h-5 mb-8 text-xs sm:text-base">
  {#each ticks.slice(1) as brk, i}
    <div
      class="absolute top-0 h-full"
      style="width: {100 / (ticks.length - 1)}%; left: {i * (100 / (ticks.length - 1))}%; background-color: {colors[
        i
      ]};"
    />
    <div class="line" style="left: {i * (100 / (ticks.length - 1))}%;" />
    <div
      class="tick"
      style="left: {i * (100 / (ticks.length - 1))}%; transform: translateX({i == 0 && snapTicks ? '-2px' : '-50%'});"
    >
      {getPrefix(ticks[i])}{roundedClassificationDataToString(classificationCode, mode, ticks[i])}<span
        class="tick-suffix">{suffix}</span
      >
    </div>
  {/each}
  <div class="line" style="right: 0;" />
  <div class="tick" style="right: 0; transform: translateX({snapTicks ? '2px' : '50%'});">
    {getPrefix(ticks.length - 1)}{roundedClassificationDataToString(
      classificationCode,
      mode,
      ticks[ticks.length - 1],
    )}<span class="tick-suffix">{suffix}</span>
  </div>
  {#if selected !== undefined}
    <div class="absolute z-10 -top-2.5" style="left: calc({pos(selected, ticks)}% - {28 / 2}px);">
      <BreaksMarker ghost={hovered} />
    </div>
  {/if}
  {#if hovered !== undefined}
    <div class="absolute z-10 -top-2.5" style="left: calc({pos(hovered, ticks)}% - {28 / 2}px);">
      <BreaksMarker />
    </div>
  {/if}
</div>

<style>
  .line {
    position: absolute;
    top: 0;
    border-left: solid 1px black;
  }
  .tick {
    position: absolute;
    z-index: 1;
    top: calc(100% + 9px);
    text-align: center;
    transform: translateX(-50%);
  }
  .tick-suffix {
    font-size: 90%;
  }
</style>
