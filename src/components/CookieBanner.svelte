<script>
  import OnsAnalyticsBanner from "./OnsAnalyticsBanner.svelte";

  // Google Analytics
  const analyticsId = "GTM-MBCBVQS";
  const analyticsProps = {
    contentTitle: "Census maps",
    releaseDate: "20221102",
    contentType: "exploratory",
    outputSeries: "censusmaps",
  };
</script>

<OnsAnalyticsBanner {analyticsId} {analyticsProps} />
