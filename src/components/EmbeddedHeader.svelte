<script>
  import { params } from "../stores/params";
  import Logo from "./icons/Logo.svelte";
  import Census2021 from "./icons/Census2021.svelte";
</script>

{#if $params.embed}
  <header class="flex items-center gap-1 md:gap-2 h-[46px] p-2 px-5 border-b-[1px] border-b-ons-grey-15">
    <div class="">
      <a href="https://www.ons.gov.uk" target="_blank" rel="noreferrer" class="custom-ring">
        <Logo />
      </a>
    </div>
    <div class="p-3">
      <a href="https://www.ons.gov.uk/census" target="_blank" rel="noreferrer" class="fill-ons-census custom-ring">
        <Census2021 />
      </a>
    </div>
  </header>
{/if}
