<script lang="ts">
  import { params } from "../stores/params";
  import Icon from "./MaterialIcon.svelte";

  let open = true;
  const toggleOpen = () => {
    open = !open;
  };
  $: showOrHideText = open ? "Hide strapline" : "Show strapline";
</script>

<div
  class="px-6 py-5 bg-ons-ocean-blue text-ons-grey-5"
  class:hidden={$params.category}
  class:lg:block={$params.category}
>
  <div class="flex items-center gap-3 group hoverable" on:click={toggleOpen}>
    <h1 class="text-3xl font-semibold break-words">Census maps</h1>
    <div class="flex-grow ">
      <span class="px-2 bg-ons-black text-ons-grey-5 font-bold">ALPHA</span>
    </div>
    <button
      class="ml-auto group-hover:scale-125 transition-all custom-ring"
      title={showOrHideText}
      aria-label={showOrHideText}
    >
      <div class="text-2xl">
        <Icon kind="arrowForwardIos" orientation={open ? "w" : "e"} />
      </div>
    </button>
  </div>
  {#if open}
    <div class="mt-2">
      Use our maps to find out what people's lives were like across England and Wales in March 2021.
    </div>
  {/if}
</div>
