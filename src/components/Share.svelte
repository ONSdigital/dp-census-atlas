<script>
  import { page } from "$app/stores";
  import { params } from "../stores/params";
  import { geography } from "../stores/geography";

  import Icon from "./MaterialIcon.svelte";

  let complete = false;

  async function handleClick() {
    const url = $page.url.toString();
    const text = "Explore this ONS Census map";
    const title = `ONS Census maps - ${$params.variable.name} in ${$geography.displayName}`;

    try {
      if (navigator.canShare) {
        await navigator.share({ text, url, title });
      } else {
        await navigator.clipboard.writeText(url);
        complete = true;
      }
    } catch (e) {
      console.error(e);
    }
  }
</script>

<button class="flex items-center gap-2 custom-ring -ml-0.5" on:click={handleClick} class:hyperlink={!complete}>
  <div class="text-2xl text-ons-black">
    <Icon kind="share" />
  </div>
  {#if complete}
    <slot name="complete">Link copied!</slot>
  {:else}
    <slot>Share this map</slot>
  {/if}
</button>
