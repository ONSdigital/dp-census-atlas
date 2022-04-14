<script type="text/javascript">
  import Header from "./Header.svelte";
  import Footer from "./Footer.svelte";
  import Map from "./Map.svelte";
  import MapKey from "./MapKey.svelte";
  import { page } from "$app/stores";
  import { getSelectedGeography } from "../helpers/categoryHelpers";
  import { setSelectedGeographyStore } from "../data/setSelectedGeographyStore";

  $: if ($page) {
    const g = getSelectedGeography($page.url);
    setSelectedGeographyStore({ geoCode: g.geoCode, geoType: g.geoType });
  }
</script>

<div class="xl:tw-absolute tw-inset-0 xl:tw-flex tw-flex-col">
  <Header />
  <div class="tw-flex-1 tw-flex tw-flex-col-reverse xl:tw-flex-row tw-overflow-y-scroll">
    <div class="tw-flex-1 tw-grow-[3] xl:tw-max-w-[27rem]">
      <slot />
    </div>
    <div class="tw-flex-1 tw-grow-[4] tw-relative">
      <Map />
      <MapKey />
    </div>
  </div>
  <Footer />
</div>
