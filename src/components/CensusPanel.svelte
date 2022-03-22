<script lang="ts">
  import { _ } from "svelte-i18n";
  import Button from "./Button.svelte";
  import Search from "./Search.svelte";
  import TopicList from "./TopicList.svelte";

  let suggestionsVisible = false;
</script>

<div class="tw-p-6 tw-pt-8">
  <Search
    title={$_("search.title")}
    label={$_("search.label")}
    button={$_("search.button")}
    error={$_("search.error")}
  />
  <hr />
  <div class="tw-pt-6">
    <div class="tw-flex tw-items-center tw-gap-1">
      <svg
        class="tw-w-4 tw-h-4 tw-relative {suggestionsVisible ? 'tw-rotate-90 -tw-left-[0.1rem] tw-top-[0.1rem]' : ''}"
        viewBox="0 0 8 13"
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
        fill="currentColor"
        ><path
          d="M5.74,14.28l-.57-.56a.5.5,0,0,1,0-.71h0l5-5-5-5a.5.5,0,0,1,0-.71h0l.57-.56a.5.5,0,0,1,.71,0h0l5.93,5.93a.5.5,0,0,1,0,.7L6.45,14.28a.5.5,0,0,1-.71,0Z"
          transform="translate(-5.02 -1.59)"
        /></svg
      >
      <button class="tw-hyperlink" on:click={() => (suggestionsVisible = !suggestionsVisible)}>
        Show me suggestions
      </button>
    </div>
    {#if suggestionsVisible}
      <div class="tw-mt-3 tw-border-l-4 tw-border-l-gray-400 tw-p-3">
        <ul class="tw-list-disc tw-list-inside">
          <li class="tw-pb-1">
            Which areas have the
            <a href="/2021/housing/owned-and-renting/default/shared-ownership" class="tw-hyperlink">
              highest levels of shared ownership properties</a
            >?
          </li>
          <li class="tw-pb-1">
            Which areas of the country are the
            <a href="/2021/health/general-health/default/very-good" class="tw-hyperlink"> most healthy</a>?
          </li>
          <li class="tw-pb-1">
            Where are the
            <a href="/2021/housing/heating/default/no-central-heating" class="tw-hyperlink">
              highest levels of homes without central heating</a
            >?
          </li>
        </ul>
        <div class="tw-mt-5">
          <Button
            colour="secondary"
            click={() => {
              suggestionsVisible = false;
            }}
          >
            Hide this
          </Button>
        </div>
      </div>
    {/if}
  </div>
</div>
<div class="tw-p-6 ">
  <TopicList />
</div>
