<script>
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  import { page } from "$app/stores";
  import Icon from "./Icon.svelte";
</script>

<div class="flex items-center h-[46px] p-2 px-5 ">
  <div class="">
    <a href={buildHyperlink($page.url)}>
      <Icon type="logo" />
    </a>
  </div>
  <div class="mx-2 ">
    <span class="px-2  bg-black text-white font-bold">ALPHA</span>
  </div>
</div>
