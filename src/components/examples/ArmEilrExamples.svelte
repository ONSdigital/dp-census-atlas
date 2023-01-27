<script lang="ts">
  import { page } from "$app/stores";
  import { buildHyperlink } from "../../helpers/buildHyperlinkHelper";
  import { geography } from "../../stores/geography";
  export let reverseType = false;

  $: ewNotSelected = $geography.geoType !== "ew";
</script>

<ul class="pl-4 list-disc list-outside">
  <!-- https://www.ons.gov.uk/census/maps/choropleth/identity/ethnic-group/ethnic-group-tb-6a/asian-asian-british-or-asian-welsh?lad=E09000025 -->
  <li class="pb-2">
    See how ethnically diverse different neighbourhoods are in
    <a
      href={buildHyperlink(
        $page.url,
        {
          mapType: "choropleth",
          variableGroup: "identity",
          variable: "ethnic-group",
          category: {
            classification: "ethnic-group-tb-6a",
            category: "asian-asian-british-or-asian-welsh",
          },
        },
        {
          geoType: ewNotSelected ? $geography.geoType : "lad",
          geoCode: ewNotSelected ? $geography.geoCode : "E09000025",
        },
      )}
      class:hyperlink={!reverseType}
      class:hyperlink-reverse={reverseType}
    >
      {ewNotSelected ? $geography.displayName : "Newham"}</a
    >.
  </li>
  <!-- https://www.ons.gov.uk/census/maps/choropleth/identity/religion/religion-tb/no-religion?lad=W06000018 -->
  <li class="pb-2">
    View the percentages of people who reported having "No religion" across
    <a
      href={buildHyperlink(
        $page.url,
        {
          mapType: "choropleth",
          variableGroup: "identity",
          variable: "religion",
          category: {
            classification: "religion-tb",
            category: "no-religion",
          },
        },
        {
          geoType: ewNotSelected ? $geography.geoType : "lad",
          geoCode: ewNotSelected ? $geography.geoCode : "W06000018",
        },
      )}
      class:hyperlink={!reverseType}
      class:hyperlink-reverse={reverseType}
    >
      {ewNotSelected ? $geography.displayName : "Caerphilly"}</a
    >.
  </li>
  <!-- https://www.ons.gov.uk/census/maps/choropleth/population/uk-armed-forces-veteran-indicator/uk-armed-forces/previously-served-in-uk-armed-forces?lad=E07000088 -->
  <li class="pb-2">
    Find out which neighbourhoods of {ewNotSelected ? $geography.displayName : "Gosport"} had the highest percentages of
    <a
      href={buildHyperlink(
        $page.url,
        {
          mapType: "choropleth",
          variableGroup: "population",
          variable: "uk-armed-forces-veteran-indicator",
          category: {
            classification: "uk-armed-forces",
            category: "previously-served-in-uk-armed-forces",
          },
        },
        {
          geoType: ewNotSelected ? $geography.geoType : "lad",
          geoCode: ewNotSelected ? $geography.geoCode : "E07000088",
        },
      )}
      class:hyperlink={!reverseType}
      class:hyperlink-reverse={reverseType}
    >
      UK armed forces veterans</a
    >.
  </li>
</ul>
