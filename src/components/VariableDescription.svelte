<script lang="ts">
  import { tooltip } from "../actions/tooltip";
  import Icon from "./MaterialIcon.svelte";

  export let shortDescription: string;
  export let longDescription: string;
  let open = false;
  const toggleOpen = () => {
    open = !open;
  };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events (this is a larger clickable area in *addition* to the button and we don't want it to be focussable) -->
<div class="flex items-end gap-1 group hoverable" on:click={toggleOpen}>
  <div class="flex-grow">
    {shortDescription}
  </div>

  <button
    class="flex-none text-xl mb-0.5 group-hover:scale-125 duration-75 transition-all custom-ring"
    use:tooltip
    title="More information"
    aria-label="More information"
  >
    <Icon kind="info" />
  </button>
</div>
{#if open}
  <div class="mt-2 mb-4 border-l-4 border-l-ons-grey-75 p-4 py-6 bg-ons-grey-5" style="white-space:pre-wrap">
    {longDescription}
  </div>
{/if}
