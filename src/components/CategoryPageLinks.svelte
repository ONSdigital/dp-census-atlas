<script lang="ts">
  import EmbedThis from "./EmbedThis.svelte";
  import Icon from "./MaterialIcon.svelte";

  // href={`https://www.ons.gov.uk/datasets/${dataset}/editions/2021/versions/1`}
  export let dataset: string;
</script>

<section class="">
  <h2 class="mb-2 text-md font-semibold md:text-lg ">Use and share</h2>
  <div class="flex items-center gap-6">
    <a
      href={`https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates/articles/demographyandmigrationdatacontent/2022-11-02`}
      class="flex items-center gap-2 custom-ring hyperlink -ml-0.5"
      data-gtm-type="data-download"
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
