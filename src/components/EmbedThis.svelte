<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { fade } from "svelte/transition";
  import { tap, from, debounceTime, map, pipe, fromEvent } from "rxjs";
  import { delay, startWith } from "rxjs/operators";
  import { SvelteSubject } from "../util/rxUtil";
  import { getEmbedCode } from "../helpers/embedHelper";
  import Icon from "./MaterialIcon.svelte";

  let dialog: HTMLDialogElement;
  let button: HTMLButtonElement;

  onMount(() => {
    const xxx = fromEvent(button, "click").pipe(tap(console.log));
  });

  const written = new SvelteSubject(false).pipe(delay(3000));
  //   $: writtenToClipboard = false;
  const writeToClipboard = (s: string) => {
    const write = navigator.clipboard.writeText(s);
    from(write)
      .pipe(
        debounceTime(1000),
        map(() => true),
        tap(console.log),
      )
      .subscribe();
    // .then(() => {
    //   writtenToClipboard = true;
    //   setTimeout(() => {
    //     writtenToClipboard = false;
    //   }, 3000);
    // });
  };
</script>

<div class="">
  <button class="flex items-center gap-2" on:click={() => dialog.showModal()}>
    <span class="text-2xl">
      <Icon kind="code" />
    </span>

    <span> Embed </span>
  </button>
</div>

<dialog bind:this={dialog} class="m-auto max-w-5xl">
  <form method="dialog" class="p-3">
    <div class="flex  justify-between">
      <h2 class="mb-4 text-xl font-semibold md:text-2xl ">Embed this map</h2>
      <div class="text-3xl"><button class="" title="Close dialog" value="cancel"><Icon kind="close" /></button></div>
    </div>
    <div class="">
      <div class="mb-4">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
        standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make
        a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,
        remaining essentially unchanged.
      </div>
      <div class="p-4 mb-5 bg-ons-grey-15 text-sm font-mono break-all">
        {getEmbedCode($page.url)}
      </div>
    </div>
    <div class="flex items-center gap-4">
      <button
        class="flex items-center px-2 py-1 justify-center bg-ons-leaf-green custom-ring text-onswhite"
        bind:this={button}
        on:click|preventDefault={() => writeToClipboard(getEmbedCode($page.url))}>Copy to clipboard</button
      >
      {#if $written}
        <div out:fade={{ duration: 500 }}>Copied!</div>
      {/if}
    </div>
  </form>
</dialog>
