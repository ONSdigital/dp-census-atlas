<script lang="ts">
  import Icon from "./MaterialIcon.svelte";
  import { page } from "$app/stores";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
</script>

<div class="px-6 py-4 sm:py-6 ">
  <div class="mb-6">
    <a href={buildHyperlink($page.url)} class="flex items-center gap-2 custom-ring hyperlink">
      <div>Home</div>
    </a>
  </div>

  {#if $page.status === 404}
    <h2 class="mb-3 text-2xl sm:text-3xl font-semibold break-words">Not found</h2>
    {#if $page.error.message}
      <p>
        {$page.error.message}
        {#if $page.error.readMoreLink}
          <a href={$page.error.readMoreLink} class="hyperlink custom-ring whitespace-nowrap">Read more</a>
        {/if}
      </p>
    {:else}
      <p>We couldn't find the page you asked for.</p>
    {/if}
  {:else}
    <h2 class="mb-3 text-2xl sm:text-3xl font-semibold break-words">Something went wrong</h2>
    <p>We apologise for the inconvenience.</p>
  {/if}

  <div class="mt-8">
    <a href="https://www.ons.gov.uk/feedback" class="flex items-center gap-2 custom-ring hyperlink -ml-0.5">
      <div class="text-2xl text-ons-black">
        <Icon kind="comment" />
      </div>
      <div>Give us feedback</div>
    </a>
  </div>
</div>

<div class="grow" />
