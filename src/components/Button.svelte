<script lang="ts">
  import Icon from "./Icon.svelte";
  import type { IconType } from "./Icon.svelte";

  export let onClick: () => void;
  export let label: string = "";
  export let icon: IconType;
</script>

<button class="flex items-center px-2 py-1 justify-center bg-onsdarkblue text-onswhite" on:click={onClick}>
  {label}
  <div class="pl-1">
    {#if icon}
      <Icon type={icon} />
    {/if}
  </div>
</button>
