<script lang="ts">
  import { page } from "$app/stores";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  import MaterialIcon from "./MaterialIcon.svelte";

  let suggestions = false;
</script>

<div class="">
  <span class="pr-3"
    >Use our maps to find out what people's lives were like across England and Wales in March 2021.</span
  >
  <div class="inline-flex items-center gap-1">
    <div class="text-xs -ml-0.5">
      <MaterialIcon kind="arrowForwardIos" orientation={suggestions ? "e" : "n"} />
    </div>
    <button class="hyperlink-reverse" on:click={() => (suggestions = !suggestions)}> Show me examples </button>
  </div>
</div>

{#if suggestions}
  <div class="mt-3 border-l-4 border-l-ons-grey-5 p-3 pt-2 ">
    <ul class="pl-4 list-disc list-outside">
      <li class="pb-1">
        Where are there larger proportions of
        <a
          href={buildHyperlink($page.url, {
            variableGroup: "population",
            variable: "age",
            category: { classification: "resident-age-3a", category: "aged-15-years-and-under" },
          })}
          class="hyperlink-reverse"
        >
          young people</a
        >?
      </li>
      <li class="pb-1">
        Compare levels of
        <a
          href={buildHyperlink(
            $page.url,
            {
              variableGroup: "population",
              variable: "marital-and-civil-partnership-status",
              category: {
                classification: "legal-partnership-status-3a",
                category: "married-or-in-a-registered-civil-partnership",
              },
            },
            undefined,
            { geoType: "msoa", geoCode: "E02000910" },
          )}
          class="hyperlink-reverse"
        >
          marriage and civil partnerships across Walthamstow</a
        > in London.
      </li>
      <li class="pb-1">
        How is
        <a
          href={buildHyperlink(
            $page.url,
            {
              variableGroup: "population",
              variable: "household-deprivation",
              category: { classification: "hh-deprivation", category: "household-is-deprived-in-one-dimension" },
            },
            undefined,
            { geoType: "lad", geoCode: "E08000035" },
          )}
          class="hyperlink-reverse"
        >
          household deprivation in Leeds</a
        > distributed?
      </li>
      <li class="pb-1">
        Where do
        <a
          href={buildHyperlink(
            $page.url,
            {
              variableGroup: "population",
              variable: "household-size",
              category: { classification: "hh-size-5a", category: "1-person-in-household" },
            },
            undefined,
            { geoType: "oa", geoCode: "W00010584" },
          )}
          class="hyperlink-reverse"
        >
          people in Cardiff tend to live by themselves</a
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
