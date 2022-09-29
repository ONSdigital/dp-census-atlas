<script lang="ts">
  import Icon from "./MaterialIcon.svelte";
  import IntroAndExamples from "./IntroAndExamples.svelte";

  $: open = true;
  const toggleOpen = () => {
    open = !open;
  };
  $: showOrHideText = open ? "Hide heading and examples" : "Show heading and examples";
</script>

<div class="px-6 py-5 bg-ons-ocean-blue text-ons-grey-5">
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
      <IntroAndExamples />
    </div>
  {/if}
</div>
