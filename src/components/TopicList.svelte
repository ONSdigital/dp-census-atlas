<script lang="ts">
  import ONSCard from "./ons/ONSCard.svelte";
  import topics from "../data/content";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  import { selectedGeographyStore } from "../stores/stores";
</script>

{#each topics as topic, i}
  <ONSCard
    title={topic.name}
    href={buildHyperlink({
      topic: topic.slug,
      selectedGeography: $selectedGeographyStore,
    })}
    id="topic-{i}">{topic.desc}</ONSCard
  >
  {#if i < topics.length - 1}
    <hr class="component-margin--2" />
  {/if}
{/each}

<style lang="scss">
  .component-margin--2 {
    margin: 0 0 1rem;
  }
</style>
