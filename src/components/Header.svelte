<script>
  import { params } from "../stores/params";
  import Logo from "./icons/Logo.svelte";
  import Census2021 from "./icons/Census2021.svelte";
  import { content } from "../stores/content";
</script>

<header
  class="flex items-center gap-1 md:gap-2 h-[46px] p-2 px-5 border-b-[1px] border-b-ons-grey-15"
  class:hidden={$params.embed}
  class:bg-ons-ruby-red={$content.choropleth.fakeDataLoaded}
>
  <div class="">
    <a href="https://www.ons.gov.uk" class="custom-ring">
      <Logo />
    </a>
  </div>
  <div class="p-3">
    <a href="https://www.ons.gov.uk/census" class="fill-ons-census custom-ring">
      <Census2021 />
    </a>
  </div>
  {#if $content.choropleth.fakeDataLoaded}
    <div class="truncate">
      <strong class="text-white"
        >WARNING! This is a prototype. Data is synthetic. It is NOT actual 2021 Census data.</strong
      >
    </div>
  {/if}
</header>
