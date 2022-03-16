<script lang="ts">

  import Button from './Button.svelte';
  import SearchBox from './SearchBox.svelte';
  import TopicList from './TopicList.svelte';

  let suggestionsVisible = false;

</script>

<div class="p-6 pt-8 bg-onspale">
  <SearchBox name="search-census" />
  <div class="pt-6">
    <div class="flex items-center gap-1">
      <svg class="w-4 h-4 relative {suggestionsVisible ? 'rotate-90 -left-[0.1rem] top-[0.1rem]' : ''}" viewBox="0 0 8 13" xmlns="http://www.w3.org/2000/svg" focusable="false" fill="currentColor"><path d="M5.74,14.28l-.57-.56a.5.5,0,0,1,0-.71h0l5-5-5-5a.5.5,0,0,1,0-.71h0l.57-.56a.5.5,0,0,1,.71,0h0l5.93,5.93a.5.5,0,0,1,0,.7L6.45,14.28a.5.5,0,0,1-.71,0Z" transform="translate(-5.02 -1.59)"></path></svg>
      <button class="hyperlink" on:click="{() => suggestionsVisible = !suggestionsVisible}">
        Show me suggestions
      </button>
    </div>
    {#if suggestionsVisible}
      <div class="mt-3 border-l-4 border-l-gray-400 p-3 ">
        <ul class=" list-disc list-inside">
          <li class="pb-1">
            Which areas have the 
            <a href="/2021/housing/owned-and-renting/default/shared-ownership" class="hyperlink">
              highest levels of shared ownership properties</a>?
          </li>
          <li class="pb-1">
            Which areas of the country are the
            <a href="/2021/health/general-health/default/very-good" class="hyperlink">
              most healthy</a>?
          </li>
          <li class="pb-1">
            Where are the 
            <a href="/2021/housing/heating/default/no-central-heating" class="hyperlink">
              highest levels of homes without central heating</a>?
          </li>
        </ul>
        <div class="mt-5">
          <Button colour="secondary" click={() => {suggestionsVisible = false;}}>
            Hide this
          </Button>
        </div>
      </div>
    {/if}
  </div>
</div>
<div class="p-6 ">
  <TopicList />
</div>
