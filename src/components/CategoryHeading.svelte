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
  <div class="tw-flex tw-h-full tw-min-h-[5rem]">
    <div class="tw-flex tw-justify-center tw-items-center tw-min-w-[5rem] tw-bg-onsteal">
      <p class="tw-text-2xl tw-font-bold tw-m-0">
        {args ? formatPercentage(variableData[category.code]?.percentage) : percentPlaceholder}<span
          class="tw-font-normal tw-text-xl">%</span
        >
      </p>
    </div>
    <div class="tw-w-full tw-pl-4 tw-py-4 tw-text-onswhite tw-bg-onsdarkblue">
      <p class="tw-flex tw-flex-col tw-mb-0">
        <span>
          {args ? formatTemplateString(variable, variableData, category, location, category.category_h_pt2) : ""}
        </span>
        <span class="tw-text-xl tw-font-bold">
          {args ? formatTemplateString(variable, variableData, category, location, category.category_h_pt3) : ""}
        </span>
      </p>
    </div>
  </div>
</div>
