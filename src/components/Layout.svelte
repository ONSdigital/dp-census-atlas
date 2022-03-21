<script>
  import Header from "./Header.svelte";
  import Footer from "./Footer.svelte";
  import Navigation from "./Navigation.svelte";
  import Map from "./Map.svelte";
  import MapKey from "./MapKey.svelte";
</script>

<div class="xl:tw-absolute tw-inset-0 xl:tw-flex tw-flex-col">
  <Header />
  <div class="tw-flex-1 tw-flex tw-flex-col-reverse xl:tw-flex-row tw-overflow-y-scroll">
    <div class="tw-flex-1 tw-grow-[3] xl:tw-max-w-[42rem]">
      <Navigation>
        <slot />
      </Navigation>
    </div>
    <div class="tw-flex-1 tw-grow-[4] tw-relative">
      <Map />
      <MapKey />
    </div>
  </div>
  <Footer />
</div>
