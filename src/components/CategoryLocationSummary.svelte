<script type="text/javascript" lang="ts">
  import { areAllDefined } from "../util/genUtil";
  import { formatTemplateString, formatPercentage } from "../helpers/categoryHelpers";
  import { englandAndWales } from "../helpers/spatialHelper";
  import type { Variable, VariableData, Category } from "../types";
  export let variableData: VariableData;
  export let englandAndWalesVariableData: VariableData;
  export let variable: Variable;
  export let category: Category;
  export let location: string;

  let args = false;
  $: {
    args = areAllDefined([variableData, variable, category, location]);
  }
  let isNotEnglandAndWales = false;
  $: {
    isNotEnglandAndWales = location != englandAndWales.meta.name;
  }
</script>

<div>
  <h2 class="ons-u-fs-m tw-mb-1.5">{args ? `${category.name} in ${location}` : ""}</h2>
  <p>{args ? category.desc : ""}</p>
  <p>
    {args ? formatTemplateString(variable, variableData, category, location, category.cat_location_summary_pt2) : ""}
  </p>
  <p>
    {args && isNotEnglandAndWales
      ? `This compares to ${formatPercentage(englandAndWalesVariableData[category.code]?.percentage)}% for ${
          englandAndWales.meta.name
        }.`
      : ""}
  </p>
  <h3 class="tw-mb-1.5">{args ? variable.name : ""}</h3>
  <p>{args ? `${category.name} is part of ${variable.name}` : ""}</p>
  <!-- Dead link included for UR. Will point at data dictionary entry for topic when the data dictionary exists -->
  <a>{args ? `Full definition for ${variable.name}` : ""}</a>
</div>
