<script lang="ts">
  import ONSCard from "./ons/ONSCard.svelte";
  import topics from "../data/content";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  import { page } from "$app/stores";
</script>

<div>
  {#each topics as topic, i}
    <ONSCard
      title={topic.name}
      href={buildHyperlink($page.url, {
        topic: topic.slug,
      })}
      id="topic-{i}">{topic.desc}</ONSCard
    >
    {#if i < topics.length - 1}
      <hr class="component-margin--2" />
    {/if}
  {/each}
</div>

<style>
  .component-margin--2 {
    margin: 0 0 1rem;
  }
</style>
