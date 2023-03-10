<script>
  export let selected = false;
</script>

<div
  class="bg-white border-[3px] border-ons-ocean-blue w-[22px] h-[22px] rounded-sm flex flex-shrink-0 justify-center items-center focus-within:border-blue-500"
>
  {#if selected}
    <!-- #206095 -->
    <svg xmlns="http://www.w3.org/2000/svg" fill="#000" width="80%" height="80%" viewBox="0 0 24 24"
      ><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" /></svg
    >
  {/if}
</div>
