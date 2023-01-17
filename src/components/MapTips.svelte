<script lang="ts">
  import Icon from "./MaterialIcon.svelte";
  import { params } from "../stores/params";
</script>

{#if !$params.category}
  <div class="absolute top-[48%] left-1/2 -translate-x-1/2">
    <div class="px-3 py-1  rounded bg-ons-census-supporting text-ons-white">
      <div class="flex gap-2 items-center">
        <div class="hidden lg:block text-2xl">
          <Icon kind="keyboardBackspace" />
        </div>
        <div>Select a topic to visualise</div>
      </div>
    </div>
  </div>
{/if}
