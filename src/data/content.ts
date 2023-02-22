/* 
Define content resources (content json files and census data) loaded for different envs + instances of census maps

Content objects have these properties
{
  devContentJsonUrl: The url the content json can be found on for local dev / netlify
  webContentJsonUrl: The url the content json for prod or sandbox - this is generally the published florence url for 
  the content json.
  publishingContentJsonUrl: the preview / publishing-only florence url for the content json. This will only be used
  by the publishing instance.
};

NB: 
  - Use of a simple filename for urls (e.g. "2021-MASTER.json") will result in the json being simply statically imported 
  from ./staticContentJsons/index.ts rather than fetched (as long as index.ts knows about it!).
  - Setting any of the url values to a blank string will result in the content being ignored for that env.

See content readme at https://github.com/ONSdigital/dp-census-atlas/blob/develop/scripts/content/README.md for more
details.
*/

// envs / instances
export default [
  {
    devContentJsonUrl: "2021-MASTER.json",
    webContentJsonUrl: "https://www.ons.gov.uk/visualisations/censusmapsmasterconfig/2021-MASTER.json",
    publishingContentJsonUrl:
      "https://publishing.dp-prod.aws.onsdigital.uk/visualisations/censusmapsmasterconfig/2021-MASTER.json",
  },
];
