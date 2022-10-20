// A list of env-specific content.json file URLS
const fakeCensus2021 = {
  zero: {
    contentJsonUrl: "https://dp.aws.onsdigital.uk/visualisations/dvc691/release-0.json",
    contentBaseUrl: "",
  },
  dem:  {
    contentJsonUrl:
      "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-DEM.json",
    contentBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021",
  },
  edu: {
    contentJsonUrl:
      "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-EDU.json",
    contentBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021",
  },
  eilr: {
    contentJsonUrl:
      "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-EILR.json",
    contentBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021",
  },
  hou: {
    contentJsonUrl:
      "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-HOU.json",
    contentBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021",
  },
  huc: {
    contentJsonUrl:
      "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-HUC.json",
    contentBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021",
  },
  lab: {
    contentJsonUrl:
      "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-LAB.json",
    contentBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021",
  },
  mig: {
    contentJsonUrl:
      "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-MIG.json",
    contentBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021",
  },
  sogi: {
    contentJsonUrl:
      "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-SOGI.json",
    contentBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021",
  },
  ttw: {
    contentJsonUrl:
      "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-TTW.json",
    contentBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021",
  },
}

const fakeCensus2021preview = {
  zero: {
    contentJsonUrl: "https://publishing.dp.aws.onsdigital.uk/visualisations/dvc691/release-0.json",
    contentBaseUrl: "",
  },
}

export default {
  dev: {
    web: [
      fakeCensus2021.dem,
      fakeCensus2021.edu,
      fakeCensus2021.eilr,
      fakeCensus2021.hou,
      fakeCensus2021.huc,
      fakeCensus2021.lab,
      fakeCensus2021.mig,
      fakeCensus2021.sogi,
      fakeCensus2021.ttw,
    ],
    publishing:[]
  },
  netlify: {
    web: [
      fakeCensus2021.dem,
      fakeCensus2021.edu,
      fakeCensus2021.eilr,
      fakeCensus2021.hou,
      fakeCensus2021.huc,
      fakeCensus2021.lab,
      fakeCensus2021.mig,
      fakeCensus2021.sogi,
      fakeCensus2021.ttw,
    ],
    publishing: []
  },
  sandbox: {
    web: [
      fakeCensus2021.dem,
      fakeCensus2021.edu,
      fakeCensus2021.eilr,
      fakeCensus2021.hou,
      fakeCensus2021.huc,
      fakeCensus2021.lab,
      fakeCensus2021.mig,
      fakeCensus2021.sogi,
      fakeCensus2021.ttw,
    ],
    publishing:[
      fakeCensus2021preview.zero,
      fakeCensus2021.dem,
      fakeCensus2021.edu,
      fakeCensus2021.eilr,
      fakeCensus2021.hou,
      fakeCensus2021.huc,
      fakeCensus2021.lab,
      fakeCensus2021.mig,
      fakeCensus2021.sogi,
      fakeCensus2021.ttw,
    ],
  },
  staging: [],
  prod: [],
};
