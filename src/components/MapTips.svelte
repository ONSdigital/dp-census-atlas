<script>
  import Icon from "./MaterialIcon.svelte";
  import { geoTypeDescriptions } from "../helpers/geographyHelper";
  import { selection } from "../stores/selection";
  import { viewport } from "../stores/viewport";
</script>

{#if !$selection.category}
  <div class={`absolute top-[48%] left-1/2 -translate-x-1/2`}>
    <div class="z-abovemap px-3 py-1  rounded bg-ons-census-supporting text-ons-white">
      <div class="flex gap-2 items-center">
        <div class="hidden lg:block text-2xl">
          <Icon kind="keyboardBackspace" />
        </div>
        <div>Select a topic to visualise</div>
      </div>
    </div>
  </div>
{/if}

{#if $viewport}
  <div class={`absolute top-3 left-3 lg:top-5 xl:top-8 lg:left-5 xl:left-8`}>
    <div class="flex gap-1 text-sm lg:text-base">
      <div class="flex">
        <div class="z-abovemap px-3 py-1  rounded-l bg-ons-census text-ons-grey-5 font-bold">
          {$viewport.geoType.toUpperCase()}
        </div>
        <div class="z-abovemap px-3 py-1  rounded-r bg-ons-grey-75 text-ons-grey-5">
          {geoTypeDescriptions[$viewport.geoType]}
        </div>
      </div>
    </div>
  </div>
{/if}
