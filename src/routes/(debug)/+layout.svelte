<script lang="ts">
  import { onMount } from "svelte";
  import { setContentStoreOnce } from "../../data/setContentStore";

  onMount(async () => {
    setContentStoreOnce();
  });
</script>

<slot />
