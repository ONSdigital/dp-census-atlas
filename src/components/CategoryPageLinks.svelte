<script lang="ts">
  import EmbedThis from "./EmbedThis.svelte";
  import Icon from "./MaterialIcon.svelte";

  export let dataset: string;
</script>

<section class="">
  <h2 class="mb-2 text-md font-semibold md:text-lg ">Use and share</h2>
  <div class="flex items-center gap-6">
    <!-- could add attribute download="file-not-yet-available.cvs" -->
    <a
      href={`https://www.ons.gov.uk/datasets/${dataset}/editions/2021/versions/1`}
      class="flex items-center gap-2 custom-ring hyperlink -ml-0.5"
    >
      <div class="text-2xl text-ons-black">
        <Icon kind="fileDownload" />
      </div>
      <div>Download data</div>
    </a>
    <div class="">
      <EmbedThis />
    </div>
  </div>
</section>
