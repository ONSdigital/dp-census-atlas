<script lang="ts">
  import Icon from "./MaterialIcon.svelte";

  export let shortDescription: string;
  export let longDescription: string;
  let showLongDescription = false;
</script>

<div class="flex items-end gap-1">
  <div class="flex-grow">
    {shortDescription}
  </div>

  <button
    class="flex-none text-xl mb-0.5 hover:scale-110 duration-75 transition-all custom-ring"
    on:click={() => (showLongDescription = !showLongDescription)}
  >
    <Icon kind="info" />
  </button>
</div>
{#if showLongDescription}
  <div class="my-5 border-l-4 border-l-ons-grey-75 p-4 bg-ons-grey-5" style="white-space:pre-wrap">
    {longDescription}
  </div>
{/if}
