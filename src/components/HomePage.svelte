<script>
  import { _ } from "svelte-i18n";
  import Heading from "./Heading.svelte";
  import TopicList from "./TopicList.svelte";
  import AreaPanel from "./AreaPanel.svelte";
  import SearchBox from "./SearchBox.svelte";
  import Icon from "./MaterialIcon.svelte";
  import { selectGeography } from "../helpers/geographyHelper";
</script>

<svelte:head>
  <title>{$_("homePage.html.title")}</title>
  <meta name="description" content={$_("homePage.html.meta")} />
</svelte:head>

<Heading />

<div class="px-6">
  <AreaPanel />

  <section>
    <h2 class="pt-3 pb-2 font-bold text-slate-500">Topic</h2>
    <div class="mb-6">
      <SearchBox name="search-census" />
    </div>
    <TopicList />
  </section>

  <!-- <br class="" />
  <div class="text-2xl">
    <Icon kind="settings" />
  </div> -->

  <!-- <div class="">
    <button
      class=""
      on:click={() => {
        selectGeography({ geoType: "lad", geoCode: "E06000053" });
      }}
    >
      Click me
    </button>
  </div> -->
</div>
