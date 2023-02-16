<script lang="ts">
  import { page } from "$app/stores";
  import { buildHyperlink } from "../../helpers/buildHyperlinkHelper";
  import { geography } from "../../stores/geography";
  export let reverseType = false;

  $: ewNotSelected = $geography.geoType !== "ew";
</script>

<ul class="pl-4 list-disc list-outside">
  <!-- https://www.ons.gov.uk/census/maps/choropleth/identity/sexual-orientation/sexual-orientation-4a/straight-or-heterosexual?lad=W06000015 -->
  <li class="pb-2">
    View the percentages of people by
    <a
      href={buildHyperlink(
        $page.url,
        {
          mode: "choropleth",
          variableGroup: "identity",
          variable: "sexual-orientation",
          category: {
            classification: "sexual-orientation-4a",
            category: "straight-or-heterosexual",
          },
        },
        {
          geoType: ewNotSelected ? $geography.geoType : "lad",
          geoCode: ewNotSelected ? $geography.geoCode : "W06000015",
        },
      )}
      class:hyperlink={!reverseType}
      class:hyperlink-reverse={reverseType}
    >
      sexual orientation
    </a>
    across
    {ewNotSelected ? $geography.displayName : "Cardiff"}.
  </li>
  <!-- https://www.ons.gov.uk/census/maps/choropleth/work/economic-activity-status/economic-activity-status-10a/economically-active-excluding-full-time-students-in-employment?lad=E07000137 -->
  <li class="pb-2">
    Find out the percentage of
    <a
      href={buildHyperlink(
        $page.url,
        {
          mode: "choropleth",
          variableGroup: "work",
          variable: "economic-activity-status",
          category: {
            classification: "economic-activity-status-10a",
            category: "economically-active-excluding-full-time-students-in-employment",
          },
        },
        {
          geoType: ewNotSelected ? $geography.geoType : "lad",
          geoCode: ewNotSelected ? $geography.geoCode : "E07000137",
        },
      )}
      class:hyperlink={!reverseType}
      class:hyperlink-reverse={reverseType}>people in employment</a
    >
    in {ewNotSelected ? $geography.displayName : "East Lindsey"}.
  </li>
  <!-- https://www.ons.gov.uk/census/maps/choropleth/housing/type-of-central-heating-in-household/heating-type/renewable-energy-only?lad=E06000052 -->
  <li class="pb-2">
    See what percentage of households use only
    <a
      href={buildHyperlink(
        $page.url,
        {
          mode: "choropleth",
          variableGroup: "housing",
          variable: "type-of-central-heating-in-household",
          category: {
            classification: "heating-type",
            category: "renewable-energy-only",
          },
        },
        {
          geoType: ewNotSelected ? $geography.geoType : "lad",
          geoCode: ewNotSelected ? $geography.geoCode : "E06000052",
        },
      )}
      class:hyperlink={!reverseType}
      class:hyperlink-reverse={reverseType}
    >
      renewable energy for their central heating
    </a>
    in different neighbourhoods of {ewNotSelected ? $geography.displayName : "Cornwall"}.
  </li>
</ul>
