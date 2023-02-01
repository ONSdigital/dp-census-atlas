/* define content resources (content json files and census data) loaded for different envs + instances of census maps

Content objects have these properties
{
  localContentJsonUrl: the localhost url the content json will be on for local dev. 
  This will point at the scripts/content/output_content_jsons folder, served from folder root on http://localhost:8090,
  e.g. http://localhost:8090/2021-MASTER.json
  webContentJsonUrl: the published florence url for the content json. This will be used in production, but also in
  netlify instances.
  publishingContentJsonUrl: the preview / publishing-only florence url for the content json. This will only be used
  by the publishing instance.
};
*/

// envs / instances NB - use of a simple filename for urls will result in the json being simply statically imported from
// ./staticContentJsons/index.ts rather than fetched (as long as index.ts knows about it!)
export default [
  // Master
  {
    devContentJsonUrl: "2021-MASTER.json",
    webContentJsonUrl: "https://www.ons.gov.uk/visualisations/censusmapsmasterconfig/2021-MASTER.json",
    publishingContentJsonUrl:
      "https://publishing.dp-prod.aws.onsdigital.uk/visualisations/censusmapsmasterconfig/2021-MASTER.json",
  },
];
