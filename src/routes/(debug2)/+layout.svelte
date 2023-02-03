<script lang="ts">
  import { onMount } from "svelte";
  import { content as contentStore } from "../../stores/content";

  export let data;
  onMount(async () => {
    contentStore.set(data.contentForStore);
  });
</script>

<slot />
