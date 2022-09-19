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
            category: "very-good-health",
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
            variable: "heating",
            category: "no-central-heating",
          })}
          class="hyperlink-reverse"
        >
          highest levels of homes without central heating</a
        >?
      </li>
      <li class="pb-1">
        Which areas have the
        <a
          href={buildHyperlink($page.url, {
            variableGroup: "housing",
            variable: "owned-or-renting",
            category: "shared-ownership-homes",
          })}
          class="hyperlink-reverse"
        >
          highest levels of shared ownership properties</a
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
