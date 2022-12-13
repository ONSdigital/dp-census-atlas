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
          variableGroup: "identity",
          variable: "ethnic-group",
          category: {
            classification: "ethnic-group-tb-6a",
            category: "asian-asian-british-or-asian-welsh",
          },
        },
        undefined,
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
          variableGroup: "identity",
          variable: "religion",
          category: {
            classification: "religion-tb",
            category: "no-religion",
          },
        },
        undefined,
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
  <!-- https://www.ons.gov.uk/census/maps/choropleth/work/economic-activity-status/economic-activity-status-10a/economically-active-excluding-full-time-students-in-employment?lad=E07000137 -->
  <li class="pb-2">
    Find out what percentage of people were in employment in
    <a
      href={buildHyperlink(
        $page.url,
        {
          variableGroup: "work",
          variable: "economic-activity-status",
          category: {
            classification: "economic-activity-status-10a",
            category: "economically-active-excluding-full-time-students-in-employment",
          },
        },
        undefined,
        {
          geoType: ewNotSelected ? $geography.geoType : "lad",
          geoCode: ewNotSelected ? $geography.geoCode : "E07000137",
        },
      )}
      class:hyperlink={!reverseType}
      class:hyperlink-reverse={reverseType}
    >
      {ewNotSelected ? $geography.displayName : "East Lindsey"}</a
    >.
  </li>
</ul>
