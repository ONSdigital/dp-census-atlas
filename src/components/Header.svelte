<script>
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  import { page } from "$app/stores";
  import Logo from "./icons/Logo.svelte";
  import Census2021 from "./icons/Census2021.svelte";
</script>

<header class="flex items-center gap-1 h-[46px] p-2 px-5 border-b-[1px] border-b-ons-grey-15">
  <div class="">
    <a href={buildHyperlink($page.url)} class="custom-ring">
      <Logo />
    </a>
  </div>
  <div class="fill-ons-census p-3">
    <Census2021 />
  </div>
</header>
