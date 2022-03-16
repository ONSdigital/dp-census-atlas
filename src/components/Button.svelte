
<script lang="ts">

  export let colour: "primary" | "secondary" = "primary"
  export let click: () => void;
  
  // 616165 boxshodaow
</script>

<button
  on:click={click}
  class="
  custom-ring
  {colour === "primary" ? 'bg-onsgreen' : 'bg-slate-200'}
  {colour === "primary" ? 'text-white'  : ''}
  {colour === "primary" ? 'font-bold'  : ''}
   rounded-md border-b-[3px] border-b-slate-600 py-1 px-3">
  <slot></slot>
</button>
