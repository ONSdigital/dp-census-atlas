<script>
  import { areAllDefined } from "../util/genUtil";
  import { renderPercentage } from "../util/numberUtil";
  import { renderCatHeadString } from "../helpers/categoryHelper"; 
  export let variableData
  export let variable
  export let category
  export let location;
</script>

<h2>
  {#if areAllDefined([variableData, variable, category, location])}
    <div>
      <span>
        {renderPercentage(variableData[category.code].percentage)}<span>%</span>
      </span>
    </div>
    <div>
      <div>
        <span>
          {renderCatHeadString(variable, category, location, category.category_h_pt2)}
        </span>
      </div>
      <div>
        <span>
          {renderCatHeadString(variable, category, location, category.category_h_pt3)}
        </span>
      </div>
    </div>
  {:else}
    <span>loading...</span>
  {/if}
</h2>
