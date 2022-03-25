<script lang="ts">
  import { areAllDefined } from "../util/genUtil";
  import { formatTemplateString, formatPercentage } from "../helpers/categoryHelpers";
  import type { Variable, Category } from "../types";

  export let variableData: Object;
  export let variable: Variable;
  export let category: Category;
  export let location: string;

  const percentPlaceholder = "00.0";

  const areArgsDefined = () => {
    return areAllDefined([variableData, variable, category, location]);
  };
</script>

<div>
  <div>
    <span>
      {areArgsDefined() ? formatPercentage(variableData[category.code].percentage) : percentPlaceholder}<span>%</span>
    </span>
  </div>
  <div>
    <div>
      <span>
        {areArgsDefined()
          ? formatTemplateString(variable, variableData, category, location, category.category_h_pt2)
          : ""}
      </span>
    </div>
    <div>
      <span>
        {areArgsDefined()
          ? formatTemplateString(variable, variableData, category, location, category.category_h_pt3)
          : ""}
      </span>
    </div>
  </div>
</div>
