<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { fade } from "svelte/transition";
  import { fromEvent, Observable, of, concat } from "rxjs";
  import { delay, mergeMap, startWith, switchMap, tap, windowWhen } from "rxjs/operators";
  import { getEmbedCode } from "../helpers/embedHelper";
  import Icon from "./MaterialIcon.svelte";

  let dialog: HTMLDialogElement;
  let button: HTMLButtonElement;
  let copied: Observable<boolean>;

  onMount(() => {
    copied = fromEvent(button, "click").pipe(
      mergeMap(() => navigator.clipboard.writeText(getEmbedCode($page.url))),
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
    <div class="flex  justify-between">
      <h2 class="mb-4 text-xl font-semibold md:text-2xl ">Embed this map</h2>
      <div class="text-3xl">
        <button class="custom-ring" title="Close dialog" value="cancel"><Icon kind="close" /></button>
      </div>
    </div>
  </form>
  <div class="mb-4">Use the HTML code below to add this map to your own website.</div>
  <div class="p-5 mb-5 bg-ons-grey-15 text-sm font-mono break-all">
    {getEmbedCode($page.url)}
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
