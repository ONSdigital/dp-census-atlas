<script lang="ts">
  import { page } from "$app/stores";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  import MaterialIcon from "./MaterialIcon.svelte";

  let suggestions = false;
</script>

<div class="">
  <span class="mr-2">Use our interactive map to find out what people's lives are like across England and Wales.</span>
  <div class="inline-flex items-center gap-0.5">
    <div class="text-xs">
      <MaterialIcon kind="arrowForwardIos" orientation={suggestions ? "e" : "n"} />
    </div>
    <button class="hyperlink-reverse" on:click={() => (suggestions = !suggestions)}> Show me examples </button>
  </div>
</div>

{#if suggestions}
  <div class="mt-3 border-l-4 border-l-ons-grey-5 p-3 ">
    <ul class="pl-4 list-disc list-outside">
      <li class="pb-1">
        Where are people who are
        <a
          href={buildHyperlink($page.url, {
            variableGroup: "health",
            variable: "general-health",
            category: { classification: "health-in-general-3a", category: "good-health" },
          })}
          class="hyperlink-reverse"
        >
          most healthy</a
        >?
      </li>
      <li class="pb-1">
        Where are the
        <a
          href={buildHyperlink($page.url, {
            variableGroup: "housing",
            variable: "type-of-central-heating-in-household",
            category: { classification: "heating-type", category: "no-central-heating" },
          })}
          class="hyperlink-reverse"
        >
          highest levels of homes without central heating</a
        >?
      </li>
      <li class="pb-1">
        Where do people
        <a
          href={buildHyperlink($page.url, {
            variableGroup: "housing",
            variable: "tenure-of-household",
            category: { classification: "hh-tenure-5a", category: "owned-owns-outright" },
          })}
          class="hyperlink-reverse"
        >
          own their own home</a
        >?
      </li>
    </ul>
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
