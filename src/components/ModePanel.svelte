<script lang="ts">
  import { modes } from "../types";
  import { content } from "../stores/content";
  import { modeInfo } from "../helpers/modeHelpers";
  import { tooltip } from "../actions/tooltip";
  import { params } from "../stores/params";
  import Icon from "./MaterialIcon.svelte";
  import ModePanelItem from "./ModePanelItem.svelte";

  $: open = false;
  const toggleOpen = () => {
    open = !open;
  };
</script>

{#if $content?.change?.variableGroups?.length > 0}
  <section class="py-2.5 border-b-2">
    <h2 class="font-bold text-slate-500">Mode</h2>
    <!-- nested buttons are invalid html, so workaround with a clickable label -->
    <!-- svelte-ignore a11y-click-events-have-key-events (this is an *additonal* touch area to the interactive button) -->
    <label for="area-input" on:click={toggleOpen} class="group w-full text-left hoverable custom-ring">
      <div class="flex items-center gap-1">
        <div class="text-xl">{modeInfo[$params.mode].name}</div>
        <button use:tooltip class="ml-auto custom-ring" title={"Toggle mode panel"} aria-label={"Toggle mode panel"}>
          <div class="text-2xl group-hover:scale-125 transition-all ml-2">
            <Icon kind="arrowForwardIos" orientation={open ? "w" : "e"} />
          </div>
        </button>
      </div>
    </label>

    {#if open}
      <div class="-mt-0.5">
        {modeInfo[$params.mode].desc}
      </div>
      <ul class="my-3 ml-0 flex flex-col gap-2 border-l-[6px] border-l-ons-grey-15">
        {#each modes.filter((m) => m !== $params.mode) as mode}
          <ModePanelItem {mode} {toggleOpen} />
        {/each}
      </ul>
    {/if}
  </section>
{/if}
