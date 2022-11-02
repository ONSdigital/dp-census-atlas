<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { geography } from "../stores/geography";
  import { fade } from "svelte/transition";
  import { fromEvent, Observable, of, concat } from "rxjs";
  import { delay, mergeMap, startWith, switchMap, tap, windowWhen } from "rxjs/operators";
  import { getEmbedCode } from "../helpers/embedHelper";
  import { viewport } from "../stores/viewport";
  import Icon from "./MaterialIcon.svelte";

  let dialog: HTMLDialogElement;
  let button: HTMLButtonElement;
  let copied: Observable<boolean>;

  let embedInteractive = false;
  let embedAreaSearch = false;
  let embedView: "viewport" | "geography" = "geography";

  $: embedBounds = [
    $viewport?.bbox.west,
    $viewport?.bbox.south,
    $viewport?.bbox.east,
    $viewport?.bbox.north
  ]
  $: embedCode = getEmbedCode($page.url, {
    embed: true,
    embedInteractive,
    embedAreaSearch,
    embedView,
    embedBounds
  });

  onMount(() => {
    copied = fromEvent(button, "click").pipe(
      mergeMap(() => navigator.clipboard.writeText(embedCode.html)),
      switchMap(() => concat(of(true), of(false).pipe(delay(2000)))),
      startWith(false),
    );
  });

  // This function will only fire if window.dataLayer exists (ie. if analytics enabled)
  function pushAnalyticsEvent() {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: "embed",
        pageURL: $page.url.href,
      });
    }
  }
</script>

<div class="">
  <button
    class="flex items-center gap-2 custom-ring hyperlink "
    on:click={() => {
      dialog.showModal();
      pushAnalyticsEvent();
    }}
  >
    <div class="text-2xl text-ons-black">
      <Icon kind="code" />
    </div>
    <div>Embed this map</div>
  </button>
</div>

<dialog bind:this={dialog} class="m-auto max-w-5xl p-6">
  <form method="dialog">
    <div class="flex justify-between">
      <h2 class="mb-4 text-xl font-semibold md:text-2xl ">Embed this map</h2>
      <div class="text-3xl">
        <button class="custom-ring" title="Close dialog" value="cancel"><Icon kind="close" /></button>
      </div>
    </div>
  </form>
  <section class="mb-3">
    <iframe height="600px" width="100%" title="ONS Census Maps" frameborder="0" src={embedCode.url} />
  </section>
  <section class="flex gap-8 bg-ons-grey-5 px-6 py-3 border-t-ons-grey-15 border-t-[1px] mb-5">
    <!-- <h3 class="mb-4 text-lg font-semibold md:text-xl ">Options</h3> -->
    <div class="flex gap-4">
      <label class="hoverable">
        <input type="radio" bind:group={embedView} name="embedView" value={"geography"} />
        Centre on selected location ({$geography.displayName})
      </label>
      <label class="hoverable">
        <input type="radio" bind:group={embedView} name="embedView" value={"viewport"} />
        Use current map viewport
      </label>
    </div>
    <div class="">
      <label class="hoverable">
        <input type="checkbox" bind:checked={embedInteractive} class="custom-ring mr-1" />
        Allow map zoom and pan
      </label>
    </div>
    <div class="">
      <label class="hoverable">
        <input disabled type="checkbox" bind:checked={embedAreaSearch} class="custom-ring mr-1" />
        Include area search
      </label>
    </div>
  </section>

  <div class="mb-4">Use the following HTML code to add this map to your own website.</div>
  <div class="p-5 mb-5 bg-ons-grey-5 text-sm font-mono break-all">
    {embedCode.html}
  </div>
  <div class="flex items-center gap-6">
    <button
      class="flex items-center justify-center gap-2 custom-ring bg-ons-leaf-green hover:bg-[#0d753c] shadow shadow-[#073d20] text-onswhite font-semibold rounded py-3 px-4"
      style="text-rendering: optimizeLegibility"
      bind:this={button}
    >
      <div>Copy to clipboard</div>
      <div class="text-2xl">
        <Icon kind="contentCopy" />
      </div>
    </button>
    {#if $copied}
      <div out:fade={{ duration: 1000 }}>Copied!</div>
    {/if}
  </div>
</dialog>
