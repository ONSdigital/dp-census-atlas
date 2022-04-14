<script type="text/javascript" lang="ts">
  import { _, json } from "svelte-i18n";
  const links: { label: string; href: string }[] = $json("footer.links");
</script>

<footer
  class="tw-flex tw-flex-row tw-justify-between tw-items-center tw-flex-wrap tw-min-h-[44px] tw-px-4 tw-bg-onsblue tw-text-onsreverse"
>
  <div class="tw-flex tw-py-1">
    <h3 class="tw-m-0 tw-pr-4">{$_("footer.label")}</h3>
    <!-- TODO: Dead links -->
    <div class="tw-divide-x tw-divide-white">
      {#each links as { label, href }}
        <a class="tw-text-white tw-px-2" {href}>{label}</a>
      {/each}
    </div>
  </div>
  <div class="tw-flex tw-py-1">
    <a class="tw-text-white" href={$_("footer.help.href")}>{$_("footer.help.label")}</a>
  </div>
</footer>
