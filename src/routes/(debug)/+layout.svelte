<script lang="ts">
  import { onMount } from "svelte";
  import { content } from "../../stores/content";

  export let data;

  onMount(async () => {
    content.set(data.contentForStore);
  });
</script>

<slot />
