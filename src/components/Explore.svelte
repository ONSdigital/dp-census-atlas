<script lang="ts">
  import { _ } from "svelte-i18n";

  export let content: { label: string; href: string; onClick?: () => void }[];
</script>

<div>
  <h3 class="mb-3">{$_("explore.title")}</h3>
  <ul class="p-0 m-0">
    {#each content as { label, href, onClick }}
      <li>
        <a {href} on:click={onClick}>{label}</a>
      </li>
    {/each}
  </ul>
</div>
