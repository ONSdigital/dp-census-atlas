<script lang="ts">
  import { page } from "$app/stores";
  import ONSAccordion from "./ons/ONSAccordion.svelte";
  import ONSAccordionPanel from "./ons/ONSAccordionPanel.svelte";
  import Heading from "./Heading.svelte";
  import topics from "../data/content";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  import { selectedGeographyStore } from "../stores/stores";
  import { returnCorrectArticle, unCapitalizeFirstLetter } from "../util/stringUtil";

  $: topicSlug = $page.params.topic;
  $: topic = topics.find((t) => t.slug === topicSlug);
  $: selectedGeographyDisplayName = $selectedGeographyStore?.displayName;
</script>

<Heading
  serviceTitle={`Select ${returnCorrectArticle(topic.name)} ${unCapitalizeFirstLetter(
    topic.name,
  )} category to explore in ${selectedGeographyDisplayName ? selectedGeographyDisplayName : "England and Wales"}`}
/>
<div class="p-6 bg-onspale mb-6">
  <p>
    Change to a
    <a href="topics{$page.url.search}">new topic</a>
  </p>
</div>

<div class="ons-page__container ons-container">
  <main class="ons-page__main">
    {#each topic.variables as variable}
      <ONSAccordion showAll={false}>
        <ONSAccordionPanel id={variable.slug} title={variable.name} description={variable.desc}>
          <ul class="ons-list ons-list--bare">
            {#each variable.categories as category}
              <li class="ons-list__item">
                <a
                  class="ons-list__link"
                  href={buildHyperlink($page.url, {
                    topic: topic.slug,
                    variable: variable.slug,
                    category: category.slug,
                  })}
                >
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
