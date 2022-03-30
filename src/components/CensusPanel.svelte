<script lang="ts">
  import { page } from "$app/stores";
  import { _, json } from "svelte-i18n";

  import Search from "./Search.svelte";
  import TopicList from "./TopicList.svelte";
  import ONSCollapsible from "./ons/ONSCollapsible.svelte";

  import { buildHyperlink } from "../helpers/buildHyperlinkHelper";

  import type { LocaleSuggestions } from "../types";

  const suggestions: LocaleSuggestions = $json("suggestions.homePage.content");
</script>

<div class="tw-overflow-y-scroll">
  <div class="tw-p-5 tw-pt-4">
    <Search
      title={$_("search.title")}
      label={$_("search.label")}
      button={$_("search.button")}
      error={$_("search.error")}
    />
    <hr class="tw-pb-5" />
    <div class="tw-pb-3">
      <h3 class="tw-mb-1">{$_("homePage.topicList.title")}</h3>
      <p>
        {$_("homePage.topicList.description")}
      </p>
    </div>
    <div class="tw-pb-6">
      <TopicList />
    </div>
    <div class="tw-pb-16">
      <ONSCollapsible isRegularFontWeightTitle title={$_("suggestions.homePage.title")} a11yHeading>
        {#each suggestions as { topic, variable, category, label }}
          <p>
            <a
              href={buildHyperlink($page.url, {
                topic: topic,
                variable: variable,
                category: category,
              })}
            >
              {label}
            </a>
          </p>
        {/each}
      </ONSCollapsible>
    </div>
  </div>
</div>
