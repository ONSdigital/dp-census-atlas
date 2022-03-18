<script lang="ts">
  import { getContext } from "svelte";
  import { TABS } from "./Tabs.svelte";

  export let forInput: string;

  const tab = {};
  const { registerTab, selectTab, selectedTab } = getContext(TABS);

  registerTab(tab);

  let selectedBorderBottomClass = "border-b-4 border-b-black";
  let selectedBackgroundClass = "bg-onspale";
</script>

<button
  on:click={() => selectTab(tab)}
  class="p-6 pr-7 text-xl {$selectedTab === tab ? selectedBackgroundClass : ''} custom-ring"
>
  <label
    for={forInput}
    class="cursor-pointer pb-1
		{$selectedTab === tab ? selectedBorderBottomClass : ''}
		"
  >
    <slot />
  </label>
</button>
