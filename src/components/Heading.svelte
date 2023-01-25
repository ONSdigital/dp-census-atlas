<script lang="ts">
  import { params } from "../stores/params";
</script>

<div class="px-6 py-4 sm:py-6 bg-ons-ocean-blue text-ons-grey-5">
  <h1 class="text-2xl sm:text-3xl font-semibold break-words">Census maps</h1>
  <div class={`mt-2 ${!$params.variableGroup && !$params.category ? "" : "hidden xs:block"}`}>
    Use our maps to find out what people's lives were like across England and Wales in March 2021.
  </div>
</div>
