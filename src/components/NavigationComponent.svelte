<script>
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  import { page } from "$app/stores";

  export let topicSlug, search, currentURL, onClick;

  $: currentLocationLink = search ? `${currentURL}${search}` : currentURL;
</script>

<div class={"flex bg-onsblue m-0 py-1.5 navigation-container"}>
  <div class="flex justify-center flex-grow border-r-[0.25px]">
    <a
      class="text-white"
      href={buildHyperlink($page.url, {
        topic: topicSlug,
      })}>New category</a
    >
  </div>
  <div class="flex justify-center flex-grow border-r-[0.25px]">
    <a class="text-white" href={currentLocationLink} on:click={onClick}> New location </a>
  </div>
  <div class="flex justify-center flex-grow border-r-[0.25px]">
    <a class="text-white" href={buildHyperlink($page.url)}>Back to start</a>
  </div>
</div>
