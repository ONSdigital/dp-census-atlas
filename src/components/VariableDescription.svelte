<script lang="ts">
  import Icon from "./MaterialIcon.svelte";

  export let shortDescription: string;
  export let longDescription: string;
  let open = false;
  const toggleOpen = () => {
    open = !open;
  };
</script>

<div class="flex items-end gap-1 group hoverable" on:click={toggleOpen}>
  <div class="flex-grow">
    {shortDescription}
  </div>

  <button
    class="flex-none text-xl mb-0.5 group-hover:scale-125 duration-75 transition-all custom-ring"
    title="Show full description"
    aria-label="Show full description"
  >
    <Icon kind="info" />
  </button>
</div>
{#if open}
  <div class="mt-3 mb-4 border-l-4 border-l-ons-grey-75 p-4 bg-ons-grey-5" style="white-space:pre-wrap">
    {longDescription}
  </div>
{/if}
