<script lang="ts">
  import { page } from "$app/stores";
  import { _ } from "svelte-i18n";

  import { selectedGeographyStore } from "../stores/stores";
  import { returnCorrectArticle, unCapitalizeFirstLetter } from "../util/stringUtil";
  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";
  import topics from "../data/content";

  import ONSAccordion from "./ons/ONSAccordion.svelte";
  import ONSAccordionPanel from "./ons/ONSAccordionPanel.svelte";
  import SearchHeader from "./SearchHeader.svelte";
  import Heading from "./Heading.svelte";
  import Explore from "./Explore.svelte";

  let changeLocation: boolean = false;

  $: topicSlug = $page.params.topic;
  $: topic = topics.find((t) => t.slug === topicSlug);
  $: selectedGeographyDisplayName = $selectedGeographyStore?.displayName;
</script>

<div class="flex flex-col max-h-full">
  {#if changeLocation}
    <SearchHeader onClose={() => (changeLocation = !changeLocation)} />
  {:else}
    <Heading
      serviceTitle={$_("topicPage.heading.serviceTitle", {
        values: {
          topicArticle: returnCorrectArticle(topic.name),
          topicName: unCapitalizeFirstLetter(topic.name),
          selectedGeographyDisplayName: selectedGeographyDisplayName
            ? selectedGeographyDisplayName
            : $_("defaultGeography"),
        },
      })}
    />
  {/if}
  <div class="overflow-y-scroll p-3">
    <p class="m-0 pb-5">
      Change to a
      <a href={buildHyperlink($page.url, null, "topics")}>new topic</a>
    </p>
    <div class="flex flex-col gap-11">
      <div>
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
                      class="underline"
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
      <Explore
        content={[
          {
            label: $_("explore.newTopicLabel"),
            href: buildHyperlink($page.url, null, "topics"),
          },

          {
            label: selectedGeographyDisplayName ? $_("explore.chooseLocationLabel") : $_("explore.newLocationLabel"),
            href: "",
            onClick: () => (changeLocation = !changeLocation),
          },
          {
            label: $_("explore.backToStartLabel"),
            href: buildHyperlink($page.url),
          },
        ]}
      />
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
