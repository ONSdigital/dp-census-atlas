<script lang="ts">
  import { modeDisplayNames } from "../helpers/modeHelpers";
  import { tooltip } from "../actions/tooltip";
  import { params } from "../stores/params";
  import Icon from "./MaterialIcon.svelte";

  $: open = false;
  const toggleOpen = () => {
    open = !open;
  };
</script>

{#if $params.mode === "change"}
  <section class="py-2.5 border-b-2">
    <h2 class="font-bold text-slate-500">Mode</h2>
    <!-- nested buttons are invalid html, so workaround with a clickable label -->
    <!-- svelte-ignore a11y-click-events-have-key-events (this is an *additonal* touch area to the interactive button) -->
    <label for="area-input" on:click={toggleOpen} class="group w-full text-left hoverable custom-ring">
      <div class="flex items-center gap-1">
        <div class="text-xl">{modeDisplayNames[$params.mode]}</div>
        <button use:tooltip class="ml-auto custom-ring" title={"Toggle mode panel"} aria-label={"Toggle mode panel"}>
          <div class="text-2xl group-hover:scale-125 transition-all ml-2">
            <Icon kind="arrowForwardIos" orientation={open ? "w" : "e"} />
          </div>
        </button>
      </div>
    </label>

    {#if open}
      <!-- <div class="mt-3 mb-1 pl-3 flex flex-col gap-2">
      <a class="flex gap-2 items-center" href="/">
        <div class="text-xl text-ons-white bg-ons-census-secondary flex items-center">
          <Icon kind="changeHistory" />
        </div>
        <div class="hyperlink-subdued">Simple map</div>
      </a>
      <div class="flex gap-2 items-center">
        <div class="">Change since 2011</div>
      </div>
      <div class="flex gap-2 items-center">
        <div class="">Dot Density</div>
      </div>
    </div> -->
    {/if}
  </section>
{/if}
