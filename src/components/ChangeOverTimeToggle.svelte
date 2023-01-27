<script lang="ts">
  import { page } from "$app/stores";
  import { params } from "../stores/params";
  import { content } from "../stores/content";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  import type { MapType, VariableGroup } from "../types";
  import { gotoUrl } from "../helpers/navigationHelper";
  import { contentInVariableGroups } from "../helpers/contentHelpers";

  $: nextMapType = $params.mapType === "change-over-time" ? "choropleth" : ("change-over-time" as MapType);
  $: nextMapTypeUrl = buildHyperlink($page.url, {
    mapType: nextMapType,
    variableGroup: $params.variableGroup.slug,
    ...($params.variable && { variable: $params.variable.slug }),
    ...($params.classification && {
      category: { classification: $params.classification.slug, category: $params.category.slug },
    }),
  });
  $: linkText =
    $params.mapType === "change-over-time"
      ? "View results of the 2021 census"
      : "View relative change since the 2011 census";
  $: showLink =
    $params.mapType === "change-over-time"
      ? true
      : contentInVariableGroups($content["change-over-time"].variableGroups, {
          variableGroup: $params.variableGroup,
          ...($params.variable && { variable: $params.variable }),
          ...($params.classification && { classification: $params.classification }),
        });
</script>

{#if showLink}
  <a
    class="hyperlink-without-group-hover "
    href="{nextMapTypeUrl})()}"
    on:click|preventDefault={() => {
      gotoUrl(nextMapTypeUrl);
    }}>{linkText}</a
  >
{/if}
