<script lang="ts">
  import { _, json } from "svelte-i18n";
  const links: { label: string; href: string }[] = $json("footer.links");
</script>

<footer class="flex flex-row justify-between items-center flex-wrap min-h-[44px] px-4 bg-onsblue text-onsreverse">
  <div class="flex py-1">
    <h3 class="m-0 pr-4">{$_("footer.label")}</h3>
    <!-- TODO: Dead links -->
    <div class="divide-x divide-white">
      {#each links as { label, href }}
        <a class="text-white px-2" {href}>{label}</a>
      {/each}
    </div>
  </div>
  <div class="flex py-1">
    <a class="text-white" href={$_("footer.help.href")}>{$_("footer.help.label")}</a>
  </div>
</footer>
