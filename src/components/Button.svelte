<script type="text/javascript" lang="ts">
  import Icon from "./Icon.svelte";
  import type { IconType } from "./Icon.svelte";

  export let onClick: () => void;
  export let label: string = "";
  export let icon: IconType;
</script>

<button
  class="tw-flex tw-items-center tw-px-2 tw-py-1 tw-justify-center tw-bg-onsdarkblue tw-text-onswhite"
  on:click={onClick}
>
  {label}
  <div class="tw-pl-1">
    {#if icon}
      <Icon type={icon} />
    {/if}
  </div>
</button>
