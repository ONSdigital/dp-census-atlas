<script type="text/javascript">
  export let selected = false;
</script>

<div class="tw-w-5 h-5 tw-bg-onsblue tw-rounded-full tw-flex tw-items-center tw-justify-center">
  <div class="tw-w-3.5 h-3.5 tw-bg-white tw-rounded-full tw-flex tw-items-center tw-justify-center">
    {#if selected}
      <div class="tw-w-2 tw-h-2 tw-bg-onsblue tw-rounded-full" />
    {/if}
  </div>
</div>
