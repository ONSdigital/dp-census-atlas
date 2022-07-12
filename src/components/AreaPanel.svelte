<script lang="ts">
  import { selectedGeographyStore } from "../stores/stores";
  $: selectedGeographyDisplayName = $selectedGeographyStore?.displayName;
  $: selectedGeographyGeoType = $selectedGeographyStore?.geoType.toUpperCase();

  $: open = false;
  let q = "";
  let inputRef;
  const handleClick = () => {
    // inputRef.focus();

    open = !open;
    // if (open) {
    //   inputRef.focus();
    // }
  };
  //   $: if (open) {
  //     inputRef.focus();
  //   }
</script>

<div class="py-3 border-b-2 border-t-2">
  <div class=" font-bold text-slate-500">Area</div>
  <button class="w-full text-left" on:click={handleClick}>
    <div class="flex items-center gap-1">
      <div class="flex-grow flex items-center gap-2 text-xl ">
        <div class="">
          {selectedGeographyDisplayName}
        </div>
        {#if selectedGeographyGeoType !== "EW"}
          <div class="ml-0.5 text-sm bg-ons-census text-white font-bold px-1 rounded-sm">
            {selectedGeographyGeoType}
          </div>
        {/if}
      </div>

      <div class={open ? "rotate-180" : ""}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </button>
  {#if open}
    <div class="mt-3 mb-1">
      <div class="flex max-w-[25rem]">
        <input
          bind:this={inputRef}
          id="area-input"
          name="area-input"
          type="search"
          autocomplete="off"
          class="flex items-center justify-center h-12 p-2 w-full border-l-2 border-t-2 border-b-2 border-black focus:border-4 custom-ring"
          bind:value={q}
        />
        <button tabindex="-1" type="submit" class="bg-onsblue px-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-white "
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="3"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
      <div class="mt-2 text-sm text-onsdark">For example, your home town, a postcode or district</div>
    </div>
  {/if}
</div>
