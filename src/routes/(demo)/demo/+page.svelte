<script lang="ts">
  import Junk from "./junk.svelte";
</script>

<!-- <div id="outer" class="absolute inset-0 flex flex-col min-w-[340px] text-ons-black text-sm md:text-base">
  <div id="header" class="">Header</div>
  <div id="main" class="bg-red-200 grow flex relative overflow-y-auto">
    <div id="overlay" class={`bg-ons-black`} />
    <div id="nav" class={`bg-purple-200 relative overflow-y-clip lg:w-[27rem] xl:w-[32rem]`}>
      <div class="overflow-y-auto absolute inset-0 ">
        <Junk />
      </div>
    </div>
    <div id="map" class={`bg-blue-200 grow`}>map</div>
  </div>
</div> -->

<div class="absolute inset-0 flex flex-col text-black">
  Hello
  <!-- main -->
  <div class={`grow flex relative overflow-y-none bg-red-200`}>
    <!-- nav -->
    <div class={`bg-blue-200 w-64 absolute inset-0 overflow-y-clip translate-x-5 `}>
      <div class="overflow-y-auto">Lots of content</div>

      <!-- toggle -->
    </div>
    <div class="bg-green-200 w-64 absolute inset-0 left-[100%] translate-x-56">
      unclickable <button>content</button>
    </div>
  </div>
</div>
