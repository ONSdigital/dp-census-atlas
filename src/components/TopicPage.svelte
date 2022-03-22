<script lang="ts">

  import { page } from '$app/stores';
  import ONSAccordion from "./ons/ONSAccordion.svelte";
  import ONSAccordionPanel from "./ons/ONSAccordionPanel.svelte";
  import topics from '../data/content'

  $: url = $page.url;
  $: topicSlug = $page.params.topic;
  $: topic = topics.find((t) => t.slug === topicSlug);
</script>

<!-- TODO: Move breadcrumbs into seperate component, wrap navigation slot in container and main elements/classes -->

<div class="p-6 bg-onspale mb-6">
  <p>
    Change to a
    <a href="/">new topic</a>
  </p>
</div>

<div class="ons-page__container ons-container">
  <main class="ons-page__main">
    <h1 class="text-3xl mb-0.5">{topic.name}</h1>
    <div class="mb-6">
      {topic.desc}
    </div>
    {#each topic.variables as variable}
    <ONSAccordion showAll={false}>
      <ONSAccordionPanel id={variable.slug} title={variable.name} description={variable.desc}>
        <ul class="ons-list ons-list--bare">
          {#each variable.categories as category}
          <li class="ons-list__item">
            <a class="ons-list__link"
              href={`/2021/${topic.slug}/${variable.slug}/default/${category.slug}${url.search}`}>
              {category.name}
            </a>
          </li>
          {/each}
        </ul>
      </ONSAccordionPanel>
    </ONSAccordion>
    {/each}
  </main>
</div>

<style lang="scss">
  @import "../../node_modules/@ons/design-system/scss/vars/_index.scss";

  a { 
    text-decoration: underline;
  }
  a:visited {
    color: $color-indigo-blue;
  }
  .ons-list--bare {
    padding-left: 1.5rem;
  }
</style>