<script>
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  import { page } from "$app/stores";
  import Census2021 from "./icons/Census2021.svelte";
</script>

<header class="flex items-center h-[46px] p-2 px-5 border-b-[1px] border-b-ons-grey-15">
  <div class="">
    <a href={buildHyperlink($page.url)} class="custom-ring"> Home </a>
  </div>
  <div class="bg-ons-census fill-white">
    <!-- <Census2021 /> -->
  </div>
  <div class="mx-2 ">
    <span class="px-2  bg-black text-white font-bold">ALPHA</span>
  </div>
</header>
