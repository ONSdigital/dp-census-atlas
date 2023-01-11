<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { geography } from "../stores/geography";
  import { fade } from "svelte/transition";
  import { fromEvent, Observable, of, concat } from "rxjs";
  import { delay, mergeMap, startWith, switchMap, tap, windowWhen } from "rxjs/operators";
  import { getEmbedCode, getPageUrlNoGeoParam } from "../helpers/embedHelper";
  import { viewport } from "../stores/viewport";
  import Icon from "./MaterialIcon.svelte";
  import type { NumberQuadruple, GeoType } from "../types";

  let dialog: HTMLDialogElement;
  let button: HTMLButtonElement;
  $: open = false;
  let copied: Observable<boolean>;

  let embedInteractive = true;
  let embedAreaSearch = false;
  let embedCategorySelection = false;
  let embedView: "viewport" | "geography" = "geography";
  let embedSelectGeo = true;
  let doGeoLock = false;
  $: geoLock = $viewport?.geoType || "ew";

  $: embedBounds = [
    $viewport?.bbox.west,
    $viewport?.bbox.south,
    $viewport?.bbox.east,
    $viewport?.bbox.north,
  ] as NumberQuadruple;

  $: pageUrlForEmbed = embedSelectGeo ? $page.url : getPageUrlNoGeoParam($page.url);

  $: embedCode = getEmbedCode(pageUrlForEmbed, {
    embed: true,
    embedInteractive,
    embedAreaSearch,
    embedCategorySelection,
    embedView,
    ...(embedView === "viewport" && { embedBounds: embedBounds }), // don't include embed bounds unless we need to!
    ...(doGeoLock && { geoLock: geoLock }), // don't include geoLock unless we need to!
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
      open = true;
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

<dialog bind:this={dialog} on:close={() => (open = false)} class="m-auto max-w-5xl p-6">
  <form method="dialog">
    <div class="flex justify-between">
      <h2 class="mb-4 text-xl font-semibold md:text-2xl ">Embed this map</h2>
      <div class="text-3xl">
        <button class="custom-ring" title="Close dialog" value="cancel"><Icon kind="close" /></button>
      </div>
    </div>
  </form>
  <div class="mb-4">
    Select your preferred embed options and copy the HTML code. There is a preview of the embedded map below.
  </div>
  <section class="flex gap-8 px-2 py-1">
    <div class="">
      <label class="hoverable">
        <input type="checkbox" bind:checked={embedInteractive} class="custom-ring mr-1" />
        Interactivity
      </label>
    </div>
    <div class="">
      <label class="hoverable">
        <input type="checkbox" bind:checked={embedAreaSearch} class="custom-ring mr-1" />
        Area search
      </label>
    </div>
    <div class="">
      <label class="hoverable">
        <input type="checkbox" bind:checked={embedCategorySelection} class="custom-ring mr-1" />
        Category selection
      </label>
    </div>
    <div class="">
      <label class="hoverable">
        <input type="checkbox" bind:checked={doGeoLock} class="custom-ring mr-1" />
        Lock geotype to {geoLock.toUpperCase()}
      </label>
    </div>
  </section>
  <section class="flex gap-8 px-2 py-1 mb-5">
    <div class="flex gap-4">
      {#if $geography.geoType !== "ew"}
        <div class="">
          <label class="hoverable">
            <input type="checkbox" bind:checked={embedSelectGeo} class="custom-ring mr-1" />
            {$geography.displayName} selected
          </label>
        </div>
      {/if}
      <label class="hoverable">
        <input type="radio" bind:group={embedView} name="embedView" value={"geography"} class="custom-ring" />
        {#if embedSelectGeo}
          Fit map to {$geography.displayName}
        {:else}
          Fit map to England and Wales
        {/if}
      </label>
      <label class="hoverable">
        <input type="radio" bind:group={embedView} name="embedView" value={"viewport"} class="custom-ring" />
        Fit map to current view
      </label>
    </div>
  </section>
  <section class="flex gap-6">
    <div class="px-4 border-y-8 border-ons-grey-5 bg-ons-grey-5 text-sm font-mono break-all h-24 overflow-y-scroll">
      {embedCode.html}
    </div>
    <div class="flex flex-col gap-3 pt-1">
      <button
        class="flex items-center justify-center gap-2 custom-ring bg-ons-leaf-green hover:bg-[#0d753c] shadow shadow-[#073d20] text-onswhite font-semibold rounded py-3 px-4 whitespace-nowrap"
        style="text-rendering: optimizeLegibility"
        bind:this={button}
      >
        <div>Copy to clipboard</div>
        <div class="text-2xl">
          <Icon kind="contentCopy" />
        </div>
      </button>
      {#if $copied}
        <div class="text-center" out:fade={{ duration: 1000 }}>Copied!</div>
      {/if}
    </div>
  </section>

  {#if open}
    <section class="mt-5">
      <iframe height="600px" width="100%" title="ONS Census Maps" frameborder="0" src={embedCode.url} />
    </section>
  {/if}
</dialog>
