<script lang="ts">
  import { areAllDefined } from "../util/genUtil";
  import { formatPercentage, formatTemplateString } from "../helpers/categoryHelpers";
  import { choroplethColours } from "../helpers/choroplethHelpers";
  import { vizStore } from "../stores/stores";
  export let variableData;
  export let variable;
  export let category;
  export let location;
  let args: boolean = false;
  let colour: number = 0;

  $: {
    /* Get choroplethColor based on current percentage */
    $vizStore?.breaks.every((_, index) => {
      if (variableData[category.code]?.percentage < _) {
        colour = index;
        return false;
      }
      return true;
    });
  }

  const percentPlaceholder = "00.0";

  $: {
    args = areAllDefined([variableData, variable, category, location]);
  }
</script>

<div>
  <div class="flex h-full min-h-[5rem]">
    <div
      class="flex justify-center items-center min-w-[5rem]"
      style={`background-color: ${choroplethColours[colour]};`}
    >
      <p class={`text-2xl font-bold m-0 ${colour > 2 ? "text-onswhite" : ""}`}>
        {args ? formatPercentage(variableData[category.code]?.percentage) : percentPlaceholder}<span
          class="font-normal text-xl">%</span
        >
      </p>
    </div>
    <div class="w-full pl-4 py-4 text-onswhite bg-onsdarkblue">
      <p class="flex flex-col mb-0">
        <span>
          {args ? formatTemplateString(variable, variableData, category, location, category.category_h_pt2) : ""}
        </span>
        <span class="text-xl font-bold">
          {args ? formatTemplateString(variable, variableData, category, location, category.category_h_pt3) : ""}
        </span>
      </p>
    </div>
  </div>
</div>
