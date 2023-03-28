<script lang="ts">
  import { tooltip } from "../actions/tooltip";
  import Icon from "./MaterialIcon.svelte";
  export let toggleOpen: () => void;
  export let open: boolean;
</script>

<button
  on:click={toggleOpen}
  use:tooltip={{ content: "Toggle full legend" }}
  class="ml-auto custom-ring"
  title={""}
  aria-label={""}
>
  <div class="text-2xl group-hover:scale-125 transition-all">
    <Icon kind="arrowForwardIos" orientation={open ? "e" : "w"} />
  </div>
</button>
