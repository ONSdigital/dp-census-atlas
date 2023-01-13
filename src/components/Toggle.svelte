<script lang="ts">
  import { nav } from "../stores/nav";
  import Icon from "./MaterialIcon.svelte";
</script>

<button
  class="relative flex flex-col justify-center items-center z-50 bg-ons-white w-[40px] h-[76px] py-3 rounded-r-md  shadow-[6px_4px_10px_-1px_rgba(0,0,0,0.3)] transform-gpu hover:bg-ons-grey-55 active:bg-ons-white custom-ring"
  on:click={() => {
    nav.set({ open: !$nav.open });
  }}
>
  {#if $nav.open}
    <div class="text-2xl text-ons-grey-100">
      <Icon kind="arrowLeftFill" />
    </div>
  {:else}
    <div class="flex items-center px-2 text-2xl">
      <Icon kind="menu" />
    </div>
  {/if}
</button>
