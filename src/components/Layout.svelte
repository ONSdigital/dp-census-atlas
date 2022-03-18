<script>
  import Header from "./Header.svelte";
  import Footer from "./Footer.svelte";
  import Navigation from "./Navigation.svelte";
  import Map from "./Map.svelte";
  import MapKey from "./MapKey.svelte";
</script>

<div class="xl:absolute inset-0 xl:flex flex-col">
  <Header />
  <div class="flex-1 flex flex-col-reverse xl:flex-row overflow-y-scroll">
    <div class="flex-1 grow-[3] xl:max-w-[42rem]">
      <Navigation>
        <slot />
      </Navigation>
    </div>
    <div class="flex-1 grow-[4] relative">
      <Map />
      <MapKey />
    </div>
  </div>
  <Footer />
</div>
