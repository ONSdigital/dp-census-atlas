<script lang="ts">
  import { params } from "../stores/params";
  import EmbedThis from "./EmbedThis.svelte";
  import Share from "./Share.svelte";
  import Icon from "./MaterialIcon.svelte";

  export let dataDownloadUrl: string;
</script>

<section class="p-6 pt-4 bg-ons-grey-5 border-t-ons-grey-15 border-t-[1px]">
  <h2 class="mb-2 text-base font-semibold">Use and share</h2>
  <div class="flex items-center gap-x-6 lg:gap-x-8 flex-wrap ">
    <div>
      <Share />
    </div>

    <a href="https://www.ons.gov.uk/feedback" class="flex items-center gap-2 custom-ring hyperlink -ml-0.5">
      <div class="text-2xl text-ons-black">
        <Icon kind="comment" />
      </div>
      <div>Give us feedback</div>
    </a>

    {#if dataDownloadUrl}
      <a
        href={dataDownloadUrl}
        class="flex items-center gap-2 custom-ring hyperlink -ml-0.5"
        data-gtm-type="data-download"
      >
        <div class="text-2xl text-ons-black">
          <Icon kind="fileDownload" />
        </div>
        <div>Download data</div>
      </a>
    {/if}

    {#if !$params.embed}
      <div class="hidden md:block">
        <EmbedThis />
      </div>
    {/if}
  </div>
</section>
