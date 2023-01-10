<script lang="ts">
  import { params } from "../stores/params";
</script>

<div class="px-6 py-5 bg-ons-ocean-blue text-ons-grey-5">
  <div class="flex items-center gap-3 ">
    <h1 class="text-2xl sm:text-3xl font-semibold break-words">Census maps</h1>
    <div class="flex-grow ">
      <span class="px-2 bg-ons-black text-ons-grey-5 font-bold">ALPHA</span>
    </div>
  </div>
  <div class={`mt-2 ${!$params.variableGroup && !$params.category ? "" : "hidden xs:block"}`}>
    Use our maps to find out what people's lives were like across England and Wales in March 2021.
  </div>
</div>
