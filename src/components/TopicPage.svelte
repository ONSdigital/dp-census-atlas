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

<div class="tw-flex tw-flex-col tw-max-h-full">
  <Heading
    serviceTitle={`Select ${returnCorrectArticle(topic.name)} ${unCapitalizeFirstLetter(
      topic.name,
    )} category to explore in ${selectedGeographyDisplayName ? selectedGeographyDisplayName : "England and Wales"}`}
  />
  <div class="tw-px-4 tw-overflow-y-scroll">
    <div class="tw-py-3">
      <p class="tw-m-0">
        Change to a
        <a href={buildHyperlink($page.url, null, "topics")}>new topic</a>
      </p>
    </div>
    <div class="tw-pb-14">
      {#each topic.variables as variable}
        <ONSAccordion showAll={false}>
          <ONSAccordionPanel
            id={variable.slug}
            title={variable.name}
            description={variable?.topic_page_cat_desc || variable.desc}
          >
            <ul class="ons-list ons-list--bare">
              {#each variable.categories as category}
                <li>
                  <a
                    class="tw-underline"
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
    </div>
  </div>
</div>

<style>
  a:visited {
    color: var(--color-indigo-blue);
  }
  .ons-list--bare {
    padding-left: 1.5rem;
  }
</style>
