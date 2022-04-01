<script>
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  import { page } from "$app/stores";
  import Icon from "./Icon.svelte";
</script>

<div class="tw-bg-onsgrey ons-u-p-xxs">
  <span class="tw-p-y-0.5 tw-px-2 tw-bg-black tw-text-white tw-font-bold ons-u-ml-xs">ALPHA</span>
</div>

<div class="xl:tw-max-w-[27rem]">
  <div class="tw-flex tw-grow tw-shrink tw-basis-auto">
    <div class="ons-u-p-xs ons-u-pl-s ons-u-pr-s">
      <a href={buildHyperlink($page.url)}>
        <Icon type="logo" />
      </a>
    </div>
    <div class="tw-bg-onsred tw-grow-[2] tw-shrink tw-basis-auto ons-u-p-xs ons-u-pl-s ons-u-pr-s ons-u-fs-s">
      <a class="tw-text-onsblack" href={buildHyperlink($page.url)}> Census Atlas </a>
    </div>
  </div>
</div>
