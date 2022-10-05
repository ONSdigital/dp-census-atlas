// A list of env-specific content.json file URLS

export default {
  dev: [
    {
      contentJsonUrl:
        "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021-v1-ALL.json",
      contentBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021",
    },
  ],
  netlify: [
    {
      contentJsonUrl:
        "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021-v1-ALL.json",
      contentBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021",
    },
  ],
  sandbox: [
    {
      contentJsonUrl:
        "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021-v1-ALL.json",
      contentBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021",
    },
  ],
  staging: [],
  prod: [],
};
