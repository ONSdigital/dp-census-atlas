<script lang="ts">
  import { getContext } from "svelte";
  import { TABS } from "./Tabs.svelte";

  export let forInput: string;

  const tab = {};
  const { registerTab, selectTab, selectedTab } = getContext(TABS);

  registerTab(tab);

  let selectedBorderBottomClass = "tw-border-b-4 tw-border-b-black";
  let selectedBackgroundClass = "tw-bg-onspale";
</script>

<button
  on:click={() => selectTab(tab)}
  class="tw-p-6 tw-pr-7 tw-text-xl {$selectedTab === tab ? selectedBackgroundClass : ''} tw-custom-ring"
>
  <label
    for={forInput}
    class="tw-cursor-pointer tw-pb-1
		{$selectedTab === tab ? selectedBorderBottomClass : ''}
		"
  >
    <slot />
  </label>
</button>
