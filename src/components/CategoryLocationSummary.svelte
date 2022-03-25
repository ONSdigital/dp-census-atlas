<script lang="ts">
  import { areAllDefined } from "../util/genUtil";
  import { assertPluralised } from "../util/stringUtil";
  import { formatTemplateString, comparePercentage } from "../helpers/categoryHelpers";
  import { defaultGeography } from "../helpers/spatialHelper";
  import type { Variable, Category } from "../types";

  export let variableData: Object;
  export let defaultGeoVariableData: Object;
  export let variable: Variable;
  export let category: Category;
  export let location: string;

  const areArgsDefined = () => {
    return areAllDefined([variableData, defaultGeoVariableData, variable, category, location]);
  };

  const isNotDefaultGeo = () => {
    return location != defaultGeography.meta.name;
  };
</script>

<div>
  <h2>{areArgsDefined() ? `${assertPluralised(category.name)} in ${location}` : ""}</h2>
  <p>{areArgsDefined() ? category.desc : ""}</p>
  <p>
    {areArgsDefined()
      ? formatTemplateString(variable, variableData, category, location, category.cat_location_summary_pt2)
      : ""}
  </p>
  <p>
    {areArgsDefined() && isNotDefaultGeo()
      ? `Thats ${comparePercentage(
          variableData[category.code].percentage,
          defaultGeoVariableData[category.code].percentage,
        )} ${defaultGeography.meta.name}.`
      : ""}
  </p>
  <h3>{areArgsDefined() ? variable.name : ""}</h3>
  <p>{areArgsDefined() ? `${assertPluralised(category.name)} is part of ${variable.name}` : ""}</p>
  <!-- Dead link included for UR. Will point at data dictionary entry for topic when the data dictionary exists -->
  <a>{areArgsDefined() ? `Full definition for ${variable.name}` : ""}</a>
</div>
