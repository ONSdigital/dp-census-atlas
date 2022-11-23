<script lang="ts">
  import Icon from "./MaterialIcon.svelte";

  export let text: string;
  export let link: string | undefined;
</script>

<div class="flex items-center gap-3.5 mb-5 mt-5">
  <div class="self-start py-3">
    <div class="w-7 h-7 bg-ons-black rounded-full flex items-center justify-center">
      <div class="text-xl text-ons-white flex items-center justify-center">
        <Icon kind="priorityHigh" />
      </div>
    </div>
  </div>
  <div class=" bg-ons-grey-5 px-4 py-3">
    {text}
    {#if link}
      <a href={link} class="hyperlink custom-ring whitespace-nowrap">Read more</a>
    {/if}
  </div>
</div>
