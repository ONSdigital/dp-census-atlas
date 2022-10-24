<script lang="ts">
  import { page } from "$app/stores";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";

  export let reverseType = false;
</script>

<ul class="pl-4 list-disc list-outside">
  <li class="pb-1">
    Which areas have larger populations of
    <a
      href={buildHyperlink($page.url, {
        variableGroup: "population",
        variable: "age",
        category: { classification: "resident-age-3a", category: "aged-15-years-and-under" },
      })}
      class:hyperlink={!reverseType}
      class:hyperlink-reverse={reverseType}
    >
      younger people</a
    >
    or
    <a
      href={buildHyperlink($page.url, {
        variableGroup: "population",
        variable: "age",
        category: { classification: "resident-age-3a", category: "aged-65-years-and-over" },
      })}
      class:hyperlink={!reverseType}
      class:hyperlink-reverse={reverseType}
    >
      older people</a
    >?
  </li>
  <li class="pb-1">
    Which neighbourhoods of
    <a
      href={buildHyperlink(
        $page.url,
        {
          variableGroup: "population",
          variable: "household-size",
          category: {
            classification: "hh-size-5a",
            category: "1-person-in-household",
          },
        },
        undefined,
        { geoType: "lad", geoCode: "W06000011" },
      )}
      class:hyperlink={!reverseType}
      class:hyperlink-reverse={reverseType}
    >
      Swansea have the highest percentages of people living alone</a
    >?
  </li>
  <li class="pb-1">
    Compare the percentages of
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
        { geoType: "msoa", geoCode: "E02006875" },
      )}
      class:hyperlink={!reverseType}
      class:hyperlink-reverse={reverseType}
    >
      people who are married or in civil partnerships in Leeds</a
    >.
  </li>
</ul>
