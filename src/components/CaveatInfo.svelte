<script lang="ts">
  import Icon from "./MaterialIcon.svelte";

  export let text: string;
  export let link: string | undefined;
</script>

<div class="flex items-center gap-3 mt-5 sm:mt-6 bg-ons-grey-5 px-3">
  <div class="self-start py-3" aria-hidden="true">
    <div class="w-7 h-7 bg-ons-black rounded-full flex items-center justify-center">
      <div class="text-base text-ons-white flex items-center justify-center font-extrabold ">i</div>
    </div>
  </div>
  <div class="py-3 " style="white-space:pre-wrap">
    <span class="sr-only">Info</span>
    {text}
    {#if link}
      <a href={link} class="hyperlink custom-ring whitespace-nowrap">Read more</a>
    {/if}
  </div>
</div>
