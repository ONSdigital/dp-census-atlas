<script>
  export let topicSlug, search, currentURL, onClick;
  export let isMobile = false;

  $: locationQueryParam = search ? search : "";
  $: currentLocationLink = search ? `${currentURL}${search}` : currentURL;
</script>

<div class={`ons-grid ons-grid--flex navigation-container ${isMobile ? "mobile" : ""}`}>
  <div class="ons-grid__col ons-col-auto ons-grid__col--flex divider">
    <div class="ons-pl-grid-col">
      <a href={`/2021/${topicSlug}${locationQueryParam}`}>New category</a>
    </div>
  </div>
  <div class="ons-grid__col ons-col-auto ons-grid__col--flex divider">
    <div class="ons-pl-grid-col">
      <a href={currentLocationLink} on:click={onClick}> New location </a>
    </div>
  </div>
  <div class="ons-grid__col ons-col-auto ons-grid__col--flex">
    <div class="ons-pl-grid-col"><a href="/">Back to start</a></div>
  </div>
</div>

<style lang="scss">
  @import "../../node_modules/@ons/design-system/scss/vars/_index.scss";

  .navigation-container {
    min-height: 46px;
    background-color: $color-ocean-blue;
    margin: unset;
    padding: 6px 0px;
  }
  .mobile {
    margin: 0px -18px;
  }
  a {
    color: $color-white;
  }
  .divider {
    border-right: 0.25px solid $color-white;
  }
  .ons-grid__col {
    justify-content: center;
    flex-grow: 1;
    align-items: center;
    padding: unset;
  }
</style>
