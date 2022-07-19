<script lang="ts">
  import { page } from "$app/stores";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  import Button2 from "./Button2.svelte";
  import MaterialIcon from "./MaterialIcon.svelte";

  let suggestions = false;
</script>

<div class="">
  <span class="mr-0.5">
    Use our interactive map to find out what people's lives are like across England and Wales.</span
  >
  <div class="inline-flex items-center gap-0.5">
    <div class="text-xs">
      <MaterialIcon kind="arrowForwardIos" orientation={suggestions ? "e" : "n"} />
    </div>
    <button class="hyperlink " on:click={() => (suggestions = !suggestions)}> Show me examples </button>
  </div>
</div>

{#if suggestions}
  <div class="mt-3 border-l-4 border-l-gray-400 p-3 ">
    <ul class="pl-4 list-disc list-outside">
      <li class="pb-1">
        Where are people who are
        <a
          href={buildHyperlink($page.url, {
            topic: "health",
            variable: "general-health",
            category: "very-good-health",
          })}
          class="hyperlink"
        >
          most healthy</a
        >?
      </li>
      <li class="pb-1">
        Where are the
        <a
          href={buildHyperlink($page.url, {
            topic: "housing",
            variable: "heating",
            category: "no-central-heating",
          })}
          class="hyperlink"
        >
          highest levels of homes without central heating</a
        >?
      </li>
      <li class="pb-1">
        Which areas have the
        <a
          href={buildHyperlink($page.url, {
            topic: "housing",
            variable: "owned-or-renting",
            category: "shared-ownership-homes",
          })}
          class="hyperlink"
        >
          highest levels of shared ownership properties</a
        >?
      </li>
    </ul>
    <div class="mt-5">
      <Button2
        colour="secondary"
        click={() => {
          suggestions = false;
        }}
      >
        Hide examples
      </Button2>
    </div>
  </div>
{/if}
