<script lang="ts">
  import { page } from "$app/stores";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";

  export let reverseType = false;
</script>

<ul class="pl-4 list-disc list-outside">
  <li class="pb-1">
    Where are there larger proportions of
    <a
      href={buildHyperlink($page.url, {
        variableGroup: "population",
        variable: "age",
        category: { classification: "resident-age-3a", category: "aged-15-years-and-under" },
      })}
      class:hyperlink={!reverseType}
      class:hyperlink-reverse={reverseType}
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
      class:hyperlink={!reverseType}
      class:hyperlink-reverse={reverseType}
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
      class:hyperlink={!reverseType}
      class:hyperlink-reverse={reverseType}
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
      class:hyperlink={!reverseType}
      class:hyperlink-reverse={reverseType}
    >
      people in Cardiff tend to live by themselves</a
    >?
  </li>
</ul>
