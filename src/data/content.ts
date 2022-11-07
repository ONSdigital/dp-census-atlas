// define content resources (content json files and census data) and their publication state
import type { ContentIteration, ContentIterationName, ContentParams } from "../types";

const getContentIteration = (fullConfig: ContentParams, iteration: ContentIterationName): ContentIteration => {
  return {
    localFake: { contentJsonUrl: fullConfig.localContentJsonUrl, contentBaseUrl: fullConfig.fakeDataBaseUrl },
    localReal: { contentJsonUrl: fullConfig.localContentJsonUrl, contentBaseUrl: fullConfig.realDataBaseUrl },
    publicFake: { contentJsonUrl: fullConfig.publicContentJsonUrl, contentBaseUrl: fullConfig.fakeDataBaseUrl },
    prodPub: { contentJsonUrl: fullConfig.prodPubContentJsonUrl, contentBaseUrl: fullConfig.realDataBaseUrl },
    prodWeb: { contentJsonUrl: fullConfig.prodWebContentJsonUrl, contentBaseUrl: fullConfig.realDataBaseUrl },
  }[iteration];
};

const topics = [
  {
    name: "zero",
    localContentJsonUrl: "http://localhost:8090/2021/release-0.json",
    publicContentJsonUrl:
      "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/release-0.json",
    prodPubContentJsonUrl:
      "https://publishing.dp-prod.aws.onsdigital.uk/visualisations/censusatlasdryrun/release-0.json",
    prodWebContentJsonUrl: "https://www.ons.gov.uk/visualisations/censusatlasdryrun/release-0.json",
    fakeDataBaseUrl: "",
    realDataBaseUrl: "",
    publicationState: "published",
  },
  {
    name: "dem",
    localContentJsonUrl: "http://localhost:8090/2021/2021-DEM.json",
    publicContentJsonUrl:
      "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-DEM.json",
    prodPubContentJsonUrl: "https://publishing.dp-prod.aws.onsdigital.uk/visualisations/censusmapsconfig/2021-DEM.json",
    prodWebContentJsonUrl: "https://www.ons.gov.uk/visualisations/censusmapsconfig/2021-DEM.json",
    fakeDataBaseUrl: "https://ons-dp-sandbox-census-maps-dem-mig.s3.eu-west-2.amazonaws.com/FAKE",
    realDataBaseUrl: "https://ons-dp-prod-census-maps-dem-mig.s3.eu-west-2.amazonaws.com",
    publicationState: "published",
  },
  {
    name: "edu",
    localContentJsonUrl: "http://localhost:8090/2021/2021-EDU.json",
    publicContentJsonUrl:
      "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-EDU.json",
    prodPubContentJsonUrl: "",
    prodWebContentJsonUrl: "",
    fakeDataBaseUrl: "https://ons-dp-sandbox-census-maps-dem-mig.s3.eu-west-2.amazonaws.com/FAKE",
    realDataBaseUrl: "",
    publicationState: "unpublished",
  },
  {
    name: "eilr",
    localContentJsonUrl: "http://localhost:8090/2021/2021-EILR.json",
    publicContentJsonUrl:
      "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-EILR.json",
    prodPubContentJsonUrl: "",
    prodWebContentJsonUrl: "",
    fakeDataBaseUrl: "https://ons-dp-sandbox-census-maps-dem-mig.s3.eu-west-2.amazonaws.com/FAKE",
    realDataBaseUrl: "",
    publicationState: "unpublished",
  },
  {
    name: "hou",
    localContentJsonUrl: "http://localhost:8090/2021/2021-HOU.json",
    publicContentJsonUrl:
      "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-HOU.json",
    prodPubContentJsonUrl: "",
    prodWebContentJsonUrl: "",
    fakeDataBaseUrl: "https://ons-dp-sandbox-census-maps-dem-mig.s3.eu-west-2.amazonaws.com/FAKE",
    realDataBaseUrl: "",
    publicationState: "unpublished",
  },
  {
    name: "huc",
    localContentJsonUrl: "http://localhost:8090/2021/2021-HUC.json",
    publicContentJsonUrl:
      "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-HUC.json",
    prodPubContentJsonUrl: "",
    prodWebContentJsonUrl: "",
    fakeDataBaseUrl: "https://ons-dp-sandbox-census-maps-dem-mig.s3.eu-west-2.amazonaws.com/FAKE",
    realDataBaseUrl: "",
    publicationState: "unpublished",
  },
  {
    name: "lab",
    localContentJsonUrl: "http://localhost:8090/2021/2021-LAB.json",
    publicContentJsonUrl:
      "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-LAB.json",
    prodPubContentJsonUrl: "",
    prodWebContentJsonUrl: "",
    fakeDataBaseUrl: "https://ons-dp-sandbox-census-maps-dem-mig.s3.eu-west-2.amazonaws.com/FAKE",
    realDataBaseUrl: "",
    publicationState: "unpublished",
  },
  {
    name: "mig",
    localContentJsonUrl: "http://localhost:8090/2021/2021-MIG.json",
    publicContentJsonUrl:
      "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-MIG.json",
    prodPubContentJsonUrl: "https://publishing.dp-prod.aws.onsdigital.uk/visualisations/censusmapsconfig/2021-MIG.json",
    prodWebContentJsonUrl: "https://www.ons.gov.uk/visualisations/censusmapsconfig/2021-MIG.json",
    fakeDataBaseUrl: "https://ons-dp-sandbox-census-maps-dem-mig.s3.eu-west-2.amazonaws.com/FAKE",
    realDataBaseUrl: "https://ons-dp-prod-census-maps-dem-mig.s3.eu-west-2.amazonaws.com",
    publicationState: "published",
  },
  {
    name: "sogi",
    localContentJsonUrl: "http://localhost:8090/2021/2021-SOGI.json",
    publicContentJsonUrl:
      "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-SOGI.json",
    prodPubContentJsonUrl: "",
    prodWebContentJsonUrl: "",
    fakeDataBaseUrl: "https://ons-dp-sandbox-census-maps-dem-mig.s3.eu-west-2.amazonaws.com/FAKE",
    realDataBaseUrl: "",
    publicationState: "unpublished",
  },
  {
    name: "ttw",
    localContentJsonUrl: "http://localhost:8090/2021/2021-TTW.json",
    publicContentJsonUrl:
      "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-TTW.json",
    prodPubContentJsonUrl: "",
    prodWebContentJsonUrl: "",
    fakeDataBaseUrl: "https://ons-dp-sandbox-census-maps-dem-mig.s3.eu-west-2.amazonaws.com/FAKE",
    realDataBaseUrl: "",
    publicationState: "unpublished",
  },
] as ContentParams[];

const published = topics.filter((t) => t.publicationState === "published");
const prepublished = topics.filter((t) => t.publicationState === "prepublished");
const unpublished = topics.filter((t) => t.publicationState === "unpublished");

export default {
  // local dev - load everything with local content json here to preview local changes to content
  dev: {
    publishing: [] as ContentIteration[],
    web: [
      ...unpublished.map((t) => {
        return getContentIteration(t, "localFake");
      }),
      ...prepublished.map((t) => {
        return getContentIteration(t, "localFake");
      }),
      ...published.map((t) => {
        return getContentIteration(t, "localReal");
      }),
    ] as ContentIteration[],
  },

  // netlify - load real published data and fake data for everything else
  netlify: {
    publishing: [] as ContentIteration[],
    web: [
      ...unpublished.map((t) => {
        return getContentIteration(t, "publicFake");
      }),
      ...prepublished.map((t) => {
        return getContentIteration(t, "publicFake");
      }),
      ...published.map((t) => {
        return getContentIteration(t, "prodWeb");
      }),
    ] as ContentIteration[],
  },

  // ONS sandbox - load real published data and fake data for everything else
  sandbox: {
    publishing: [] as ContentIteration[],
    web: [
      ...unpublished.map((t) => {
        return getContentIteration(t, "publicFake");
      }),
      ...prepublished.map((t) => {
        return getContentIteration(t, "publicFake");
      }),
      ...published.map((t) => {
        return getContentIteration(t, "prodWeb");
      }),
    ] as ContentIteration[],
  },

  // ONS staging - unused at present
  staging: {
    publishing: [] as ContentIteration[],
    web: [] as ContentIteration[],
  },

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
  // ONS producution - only load published data / attempt to load prepublished data and load real data for everything
  prod: {
    publishing: [
      ...prepublished.map((t) => {
        return getContentIteration(t, "prodPub");
      }),
      ...published.map((t) => {
        return getContentIteration(t, "prodWeb");
      }),
    ] as ContentIteration[],
    web: [
      // attempt to load pre-published topics with prodWeb URLs to ensure they appear instantly at publication time
      ...prepublished.map((t) => {
        return getContentIteration(t, "prodWeb");
      }),
      ...published.map((t) => {
        return getContentIteration(t, "prodWeb");
      }),
    ] as ContentIteration[],
  },
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
};
