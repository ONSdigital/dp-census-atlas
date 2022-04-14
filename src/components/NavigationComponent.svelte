<script type="text/javascript">
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  import { page } from "$app/stores";

  export let topicSlug, search, currentURL, onClick;

  $: currentLocationLink = search ? `${currentURL}${search}` : currentURL;
</script>

<div class={"tw-flex tw-bg-onsblue tw-m-0 tw-py-1.5 navigation-container"}>
  <div class="tw-flex tw-justify-center tw-flex-grow tw-border-r-[0.25px]">
    <a
      class="tw-text-white"
      href={buildHyperlink($page.url, {
        topic: topicSlug,
      })}>New category</a
    >
  </div>
  <div class="tw-flex tw-justify-center tw-flex-grow tw-border-r-[0.25px]">
    <a class="tw-text-white" href={currentLocationLink} on:click={onClick}> New location </a>
  </div>
  <div class="tw-flex tw-justify-center tw-flex-grow tw-border-r-[0.25px]">
    <a class="tw-text-white" href={buildHyperlink($page.url)}>Back to start</a>
  </div>
</div>
