<script>
  import Icon from "./MaterialIcon.svelte";
  export let text = "Check out this page!";
  export let url = "https://blog.robino.dev";
  export let title = url.split("/").splice(-1)[0]; // default to end of url

  let complete = false;

  async function handleClick() {
    try {
      if (navigator.canShare) {
        await navigator.share({ text, url, title });
      } else {
        await navigator.clipboard.writeText(url);
        complete = true;
      }
    } catch (error) {
      console.log(error);
    }
  }
</script>

<button class="flex items-center gap-2 custom-ring -ml-0.5" on:click={handleClick} class:hyperlink={!complete}>
  <div class="text-2xl text-ons-black">
    <Icon kind="share" />
  </div>
  {#if complete}
    <slot name="complete">Copied!</slot>
  {:else}
    <slot>Share link</slot>
  {/if}
</button>
