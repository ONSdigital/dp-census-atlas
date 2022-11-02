// A list of env-specific content.json file URLS

// fake / demo data
const fakeCensus2021preview = {
  zero: {
    contentJsonUrl: "https://publishing.dp.aws.onsdigital.uk/visualisations/dvc691/release-0.json",
    contentBaseUrl: "",
  },
  dem:  {
    contentJsonUrl:
      "https://publishing.dp.aws.onsdigital.uk/visualisations/dvc691/2021-DEM.json",
    contentBaseUrl: "https://ons-dp-sandbox-census-maps-dem-mig.s3.eu-west-2.amazonaws.com/FAKE",
  },
  mig:  {
    contentJsonUrl:
      "https://publishing.dp.aws.onsdigital.uk/visualisations/dvc691/2021-MIG.json",
    contentBaseUrl: "https://ons-dp-sandbox-census-maps-dem-mig.s3.eu-west-2.amazonaws.com/FAKE",
  },
}

const fakeCensus2021 = {
  zero: {
    contentJsonUrl: "https://dp.aws.onsdigital.uk/visualisations/dvc691/release-0.json",
    contentBaseUrl: "",
  },
  dem:  {
    contentJsonUrl:
      "https://dp.aws.onsdigital.uk/visualisations/dvc691/2021-DEM.json",
    contentBaseUrl: "https://ons-dp-sandbox-census-maps-dem-mig.s3.eu-west-2.amazonaws.com/FAKE",
  },
  mig:  {
    contentJsonUrl:
      "https://dp.aws.onsdigital.uk/visualisations/dvc691/2021-MIG.json",
    contentBaseUrl: "https://ons-dp-sandbox-census-maps-dem-mig.s3.eu-west-2.amazonaws.com/FAKE",
  },
}

const fakeCensus2021Public = {
  dem:  {
    contentJsonUrl:
      "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-DEM.json",
    contentBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021v2",
  },
  edu: {
    contentJsonUrl:
      "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-EDU.json",
    contentBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021v2",
  },
  eilr: {
    contentJsonUrl:
      "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-EILR.json",
    contentBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021v2",
  },
  hou: {
    contentJsonUrl:
      "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-HOU.json",
    contentBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021v2",
  },
  huc: {
    contentJsonUrl:
      "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-HUC.json",
    contentBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021v2",
  },
  lab: {
    contentJsonUrl:
      "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-LAB.json",
    contentBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021v2",
  },
  mig: {
    contentJsonUrl:
      "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-MIG.json",
    contentBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021v2",
  },
  sogi: {
    contentJsonUrl:
      "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-SOGI.json",
    contentBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021v2",
  },
  ttw: {
    contentJsonUrl:
      "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-TTW.json",
    contentBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021v2",
  },
}

const fakeCensus2021Local = {
  zero: {
    contentJsonUrl: "http://localhost:8090/release-0.json",
    contentBaseUrl: "",
  },
  dem:  {
    contentJsonUrl:
      "http://localhost:8090/2021/2021-DEM.json",
    contentBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021v2",
  },
  edu: {
    contentJsonUrl:
      "http://localhost:8090/2021/2021-EDU.json",
    contentBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021v2",
  },
  eilr: {
    contentJsonUrl:
      "http://localhost:8090/2021/2021-EILR.json",
    contentBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021v2",
  },
  hou: {
    contentJsonUrl:
      "http://localhost:8090/2021/2021-HOU.json",
    contentBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021v2",
  },
  huc: {
    contentJsonUrl:
      "http://localhost:8090/2021/2021-HUC.json",
    contentBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021v2",
  },
  lab: {
    contentJsonUrl:
      "http://localhost:8090/2021/2021-LAB.json",
    contentBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021v2",
  },
  mig: {
    contentJsonUrl:
      "http://localhost:8090/2021/2021-MIG.json",
    contentBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021v2",
  },
  sogi: {
    contentJsonUrl:
      "http://localhost:8090/2021/2021-SOGI.json",
    contentBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021v2",
  },
  ttw: {
    contentJsonUrl:
      "http://localhost:8090/2021/2021-TTW.json",
    contentBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021v2",
  },
}

// REAL CENSUS 2021 DATA!

const Census2021preview = {
  zero: {
    contentJsonUrl: "https://publishing.dp-prod.aws.onsdigital.uk/visualisations/censusatlasdryrun/release-0.json",
    contentBaseUrl: "",
  },
  dem:  {
    contentJsonUrl:
      "https://publishing.dp-prod.aws.onsdigital.uk/visualisations/censusmapsconfig/2021-DEM.json",
    contentBaseUrl: "https://ons-dp-prod-census-maps-dem-mig.s3.eu-west-2.amazonaws.com",
  },
  mig:  {
    contentJsonUrl:
      "https://publishing.dp-prod.aws.onsdigital.uk/visualisations/censusmapsconfig/2021-MIG.json",
    contentBaseUrl: "https://ons-dp-prod-census-maps-dem-mig.s3.eu-west-2.amazonaws.com",
  },
}

const Census2021 = {
  zero: {
    contentJsonUrl: "https://www.ons.gov.uk/visualisations/censusatlasdryrun/release-0.json",
    contentBaseUrl: "",
  },
  dem:  {
    contentJsonUrl: "https://www.ons.gov.uk/visualisations/censusmapsconfig/2021-DEM.json",
    contentBaseUrl: "https://ons-dp-prod-census-maps-dem-mig.s3.eu-west-2.amazonaws.com",
  },
  mig:  {
    contentJsonUrl: "https://www.ons.gov.uk/visualisations/censusmapsconfig/2021-MIG.json",
    contentBaseUrl: "https://ons-dp-prod-census-maps-dem-mig.s3.eu-west-2.amazonaws.com",
  },
}

const Census2021NoFlorence = {
  dem:  {
    contentJsonUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-DEM.json",
    contentBaseUrl: "https://ons-dp-prod-census-maps-dem-mig.s3.eu-west-2.amazonaws.com",
  },
  mig:  {
    contentJsonUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-MIG.json",
    contentBaseUrl: "https://ons-dp-prod-census-maps-dem-mig.s3.eu-west-2.amazonaws.com",
  },
}


const Census2021Local = {
  dem:  {
    contentJsonUrl: "http://localhost:8090/2021/2021-DEM.json",
    contentBaseUrl: "https://ons-dp-prod-census-maps-dem-mig.s3.eu-west-2.amazonaws.com",
  },
  mig:  {
    contentJsonUrl: "http://localhost:8090/2021/2021-MIG.json",
    contentBaseUrl: "https://ons-dp-prod-census-maps-dem-mig.s3.eu-west-2.amazonaws.com",
  },
}

export default {
  // local dev
  dev: {
    web: [
      Census2021Local.dem,
      fakeCensus2021Local.edu,
      fakeCensus2021Local.eilr,
      fakeCensus2021Local.hou,
      fakeCensus2021Local.huc,
      fakeCensus2021Local.lab,
      Census2021Local.mig,
      fakeCensus2021Local.sogi,
      fakeCensus2021Local.ttw,
    ],
    publishing:[]
  },
  // netlify
  netlify: {
    web: [
      Census2021NoFlorence.dem,
      fakeCensus2021Public.edu,
      fakeCensus2021Public.eilr,
      fakeCensus2021Public.hou,
      fakeCensus2021Public.huc,
      fakeCensus2021Public.lab,
      Census2021NoFlorence.mig,
      fakeCensus2021Public.sogi,
      fakeCensus2021Public.ttw,
    ],
    publishing: []
  },
  // ONS sandbox
  sandbox: {
    web: [
      fakeCensus2021.zero,
      fakeCensus2021.dem,
      fakeCensus2021.mig,
    ],
    publishing:[
      fakeCensus2021preview.zero,
      fakeCensus2021preview.dem,
      fakeCensus2021preview.mig,
    ],
  },
  // ONS staging
  staging: {
    web: [],
    publishing: []
  },
  // ONS producution!
  prod: {
    web: [
      Census2021.zero,
      {
        contentJsonUrl:
          "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-DEM.json",
        contentBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/2021-dem-mig",
      },
      {
        contentJsonUrl:
          "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-MIG.json",
        contentBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/2021-dem-mig",
      },
    ],
    publishing: [
      Census2021preview.zero,
      Census2021preview.dem,
      Census2021preview.mig,
    ]
  },
};
