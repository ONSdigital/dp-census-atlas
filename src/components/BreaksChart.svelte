<script lang="ts">
  import { ratioToPercentage } from "../util/numberUtil";

  export let hovered = null;
  export let selected = null;
  export let lineWidth = 3;
  export let breaks = [0, 20, 40, 60, 80, 100];
  export let colors = ["rgba(234,236,177)", "rgba(169,216,145)", "rgba(0,167,186)", "rgba(0,78,166)", "rgba(0,13,84)"];
  export let suffix = "";
  export let snapTicks = true;

  const pos = (val, breaks) => {
    let i = 0;
    while (val > breaks[i + 1]) i += 1;
    let unit = 100 / (breaks.length - 1);
    let offset = (val - breaks[i]) / (breaks[i + 1] - breaks[i]);
    return (i + offset) * unit;
  };
</script>

<!-- <div class="flex justify-center absolute bottom-8 left-1/2 -translate-x-1/2">
  <div class="z-abovemap bg-white py-4"> -->
<div class="box-border relative w-full h-5 mb-8">
  {#each breaks.slice(1) as brk, i}
    <div
      class="absolute top-0 h-full"
      style="width: {100 / (breaks.length - 1)}%; left: {i * (100 / (breaks.length - 1))}%; background-color: {colors[
        i
      ]};"
    />
    <div class="line" style="left: {i * (100 / (breaks.length - 1))}%;" />
    <div
      class="tick"
      style="left: {i * (100 / (breaks.length - 1))}%; transform: translateX({i == 0 && snapTicks ? '-2px' : '-50%'});"
    >
      {ratioToPercentage(breaks[i], 0)}<span class="tick-suffix">{suffix}</span>
    </div>
  {/each}
  <div class="line" style="right: 0;" />
  <div class="tick" style="right: 0; transform: translateX({snapTicks ? '2px' : '50%'});">
    {ratioToPercentage(breaks[breaks.length - 1], 0)}<span class="tick-suffix">{suffix}</span>
  </div>
  {#if selected}
    <!-- <div class="marker" style="width: 4px; left: calc({pos(selected, breaks)}% - {lineWidth / 2}px);" /> -->
    <div class="absolute z-10 -top-2.5" style="left: calc({pos(selected, breaks)}% - {28 / 2}px);">
      <svg class="h-7 w-7" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <!-- <circle cx="50" cy="50" r="40" stroke="black" stroke-width="20" fill="white" /> -->
        <polygon points="10,10 90,10 50,78 " stroke="black" stroke-width="19" stroke-linejoin="round" fill="white" />
      </svg>
    </div>
    <!-- <div class="value" style="left: {pos(selected, breaks)}%">{selected}{suffix}</div> -->
  {/if}
  {#if hovered}
    <div
      class="marker marker-hovered"
      style="width: {lineWidth}px; left: calc({pos(hovered, breaks)}% - {lineWidth / 2}px);"
    />
    <div class="value" style="left: {pos(hovered, breaks)}%">{hovered}{suffix}</div>
  {/if}
</div>

<!-- </div>
</div> -->
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
  .marker {
    position: absolute;
    z-index: 2;
    /* top: -10px; */
    /* height: calc(100% + 10px); */
    height: calc(100%);
    background-color: black;
  }
  .value {
    position: absolute;
    top: -32px;
    text-align: center;
    transform: translateX(-50%);
    background-color: rgba(255, 255, 255, 0.8);
  }
  .marker-hovered {
    background-color: orange;
  }
</style>
