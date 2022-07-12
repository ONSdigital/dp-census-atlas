<script lang="ts">
  import Button2 from "./Button2.svelte";

  let suggestions = false;
</script>

<div class="">
  <span class="mr-1"> Use our interactive map to find out what people's lives are like across England and Wales. </span>
  <button class="hyperlink" on:click={() => (suggestions = !suggestions)}> Show me examples </button>
</div>

<!-- <div class="flex items-center gap-1">
  <svg
    class="w-4 h-4 relative {suggestions ? 'rotate-90 -left-[0.1rem] top-[0.1rem]' : ''}"
    viewBox="0 0 8 13"
    xmlns="http://www.w3.org/2000/svg"
    focusable="false"
    fill="currentColor"
    ><path
      d="M5.74,14.28l-.57-.56a.5.5,0,0,1,0-.71h0l5-5-5-5a.5.5,0,0,1,0-.71h0l.57-.56a.5.5,0,0,1,.71,0h0l5.93,5.93a.5.5,0,0,1,0,.7L6.45,14.28a.5.5,0,0,1-.71,0Z"
      transform="translate(-5.02 -1.59)"
    /></svg
  >
  <button class="hyperlink" on:click={() => (suggestions = !suggestions)}> Show me suggestions </button>

</div> -->
{#if suggestions}
  <div class="mt-3 border-l-4 border-l-gray-400 p-3 ">
    <ul class="pl-4 list-disc list-outside">
      <li class="pb-1">
        Where are people
        <a href="/2021/health/general-health/default/very-good" class="hyperlink"> most healthy</a>?
      </li>
      <li class="pb-1">
        Where are the
        <a href="/2021/housing/heating/default/no-central-heating" class="hyperlink">
          highest levels of homes without central heating</a
        >?
      </li>
      <li class="pb-1">
        Which areas have the
        <a href="/2021/housing/owned-and-renting/default/shared-ownership" class="hyperlink">
          highest levels of shared ownership properties</a
        >?
      </li>
    </ul>
    <div class="mt-5">
      <Button2
        colour="secondary"
        click={() => {
          suggestions = false;
        }}
      >
        Hide this
      </Button2>
    </div>
  </div>
{/if}
