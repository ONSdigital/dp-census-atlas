<script>
  import { areAllDefined } from "../util/genUtil";
  import { formatPercentage } from "../helpers/categoryHelper";
  import { unCapitalizeFirstLetter } from "../util/stringUtil"
  export let variableData
  export let variable
  export let category
  export let location;
  
  const percentPlaceholder = "00.0"

  const formatCatHeadString = (variable, category, location, templateStr) => { 
    const stringReplaceMap = {
      "{category_name}": unCapitalizeFirstLetter(category.name),
      "{category_unit}": unCapitalizeFirstLetter(variable.units),
      "{location}": location,
      "{variable_name}": unCapitalizeFirstLetter(variable.name),
    }
    for (const [strToReplace, replacementStr] of Object.entries(stringReplaceMap)) {
      templateStr = templateStr.replace(strToReplace, replacementStr)
    }
    return templateStr
  }

  const areArgsDefined = () => {
    return areAllDefined([variableData, variable, category, location])
  }

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
        {areArgsDefined() ? formatCatHeadString(variable, category, location, category.category_h_pt2) : ""}
      </span>
    </div>
    <div>
      <span>
        {areArgsDefined() ? formatCatHeadString(variable, category, location, category.category_h_pt3): ""}
      </span>
    </div>
  </div>
</div>
