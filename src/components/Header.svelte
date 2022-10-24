<script>
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  import { page } from "$app/stores";
  import { selection } from "../stores/selection";
  import Logo from "./icons/Logo.svelte";
  import Census2021 from "./icons/Census2021.svelte";
  import { contentStore } from "../stores/stores";
</script>

<header
  class="flex items-center gap-1 h-[46px] p-2 px-5 border-b-[1px] border-b-ons-grey-15"
  class:hidden={$selection.embed}
  class:bg-ons-ruby-red={$contentStore.fakeDataLoaded}
>
  <div class="">
    <a href={buildHyperlink($page.url)} class="custom-ring">
      <Logo />
    </a>
  </div>
  <div class="fill-ons-census p-3">
    <Census2021 />
  </div>
  {#if $contentStore.fakeDataLoaded}
    <div class="truncate">
      <strong class="text-white"
        >WARNING! This is a prototype. Data is synthetic. It is NOT actual 2021 Census data.</strong
      >
    </div>
  {/if}
</header>
