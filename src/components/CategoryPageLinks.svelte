<script lang="ts">
  import { params } from "../stores/params";
  import EmbedThis from "./EmbedThis.svelte";
  import Share from "./Share.svelte";
  import Icon from "./MaterialIcon.svelte";
  // ToDo revert this if / when the indiviudal datasets become available again!
  // href={`https://www.ons.gov.uk/datasets/${dataset}/editions/2021/versions/1`}
  export let dataDownloadUrl: string | undefined;
</script>

<section class="">
  <h2 class="mb-2 text-md font-semibold md:text-lg ">Use and share</h2>
  <div class="flex items-center gap-x-6 gap-y-1 flex-wrap ">
    <div>
      <Share />
    </div>
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
