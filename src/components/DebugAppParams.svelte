<script lang="ts">
  import { appParamsStore } from "../stores/stores";
  import { page } from "$app/stores";
</script>

<div class="">
  <div class="text-green-500">
    {JSON.stringify($page.url)}
  </div>
  <div class="text-blue-500">
    {JSON.stringify($appParamsStore)}
  </div>
  <div class="text-purple-500">
    {$page.url.searchParams.toString()}
  </div>
</div>
