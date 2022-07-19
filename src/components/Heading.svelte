<script lang="ts">
  import Icon from "./MaterialIcon.svelte";
  import IntroAndExamples from "./IntroAndExamples.svelte";

  $: open = true;
  const toggleOpen = () => {
    open = !open;
  };
  $: showOrHideText = open ? "Hide heading and examples" : "Show heading and examples";
</script>

<div class="p-6 pt-5 pb-4">
  <div class="flex items-center group hoverable" on:click={toggleOpen}>
    <h1 class="flex-grow text-3xl font-semibold break-words">Census maps</h1>
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
    <div class="mt-2.5">
      <IntroAndExamples />
    </div>
  {/if}
</div>
