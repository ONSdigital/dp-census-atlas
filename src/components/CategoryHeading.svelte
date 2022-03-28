<script>
  import { areAllDefined } from "../util/genUtil";
  import { formatPercentage, formatTemplateString } from "../helpers/categoryHelpers";
  export let variableData;
  export let variable;
  export let category;
  export let location;
  let args = false;

  const percentPlaceholder = "00.0";

  $: {
    args = areAllDefined([variableData, variable, category, location]);
  }
</script>

<div>
  <div>
    <span>
      {args ? formatPercentage(variableData[category.code]?.percentage) : percentPlaceholder}<span>%</span>
    </span>
  </div>
  <div>
    <div>
      <span>
        {args ? formatTemplateString(variable, variableData, category, location, category.category_h_pt2) : ""}
      </span>
    </div>
    <div>
      <span>
        {args ? formatTemplateString(variable, variableData, category, location, category.category_h_pt3) : ""}
      </span>
    </div>
  </div>
</div>
