<script lang="ts">
  export let colour: "primary" | "secondary" = "primary";
  export let click: () => void;

  // 616165 boxshodaow
</script>

<button
  on:click={click}
  class="
  tw-custom-ring
  {colour === 'primary' ? 'tw-bg-onsgreen' : 'tw-bg-slate-200'}
  {colour === 'primary' ? 'tw-text-white' : ''}
  {colour === 'primary' ? 'tw-font-bold' : ''}
  tw-rounded-md tw-border-b-[3px] tw-border-b-slate-600 tw-py-1 tw-px-3"
>
  <slot />
</button>
