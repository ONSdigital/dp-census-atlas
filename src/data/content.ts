// A list of env-specific content.json file URLS

export default {
  dev: [
    {
      contentJsonUrl:
        "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/newquads/2011-all-topics-with-variable-groups.json",
      contentBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/newquads",
    },
  ],
  netlify: [
    {
      contentJsonUrl:
        "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/newquads/2011-all-topics-with-variable-groups.json",
      contentBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/newquads",
    },
  ],
  sandbox: [
    {
      contentJsonUrl:
        "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/newquads/2011-all-topics-with-variable-groups.json",
      contentBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/newquads",
    },
  ],
  staging: [],
  prod: [],
};
