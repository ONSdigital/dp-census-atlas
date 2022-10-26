<script lang="ts">
  import { isInitialReleasePeriod } from "../helpers/contentHelpers";
  import { content } from "../stores/content";
  import MaterialIcon from "./MaterialIcon.svelte";
  import Examples from "./Examples.svelte";

  let suggestions = false;
</script>

<div class="">
  <span class="pr-3"
    >Use our maps to find out what people's lives were like across England and Wales in March 2021.</span
  >
  {#if !isInitialReleasePeriod($content)}
    <div class="inline-flex items-center gap-1">
      <div class="text-xs -ml-0.5">
        <MaterialIcon kind="arrowForwardIos" orientation={suggestions ? "e" : "n"} />
      </div>
      <button class="hyperlink-reverse" on:click={() => (suggestions = !suggestions)}> Show me examples </button>
    </div>
  {/if}
</div>

{#if suggestions}
  <div class="mt-3 border-l-4 border-l-ons-grey-5 p-3 pt-2 ">
    <Examples reverseType />
    <div class="mt-5">
      <button
        on:click={() => {
          suggestions = false;
        }}
        class="
        custom-ring
        bg-ons-grey-15
        text-ons-black
         rounded-md border-b-[3px] border-b-ons-grey-75 py-1 px-3"
      >
        Hide examples
      </button>
    </div>
  </div>
{/if}
