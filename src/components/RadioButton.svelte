<script>
  export let selected = false;
</script>

<div>
  <div class="w-5 h-5 bg-ons-ocean-blue rounded-full flex items-center justify-center">
    <div class="w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center">
      {#if selected}
        <div class="w-2 h-2 bg-ons-ocean-blue rounded-full" />
      {/if}
    </div>
  </div>
</div>
