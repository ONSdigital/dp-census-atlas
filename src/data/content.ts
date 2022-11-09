// define content resources (content json files and census data) loaded for different envs + instances of census maps

// topics
const zero = {
  localContentJsonUrl: "http://localhost:8090/2021/release-0.json",
  publicContentJsonUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/release-0.json",
  prodPubContentJsonUrl: "https://publishing.dp-prod.aws.onsdigital.uk/visualisations/censusatlasdryrun/release-0.json",
  prodWebContentJsonUrl: "https://www.ons.gov.uk/visualisations/censusatlasdryrun/release-0.json",
  fakeDataBaseUrl: "",
  realDataBaseUrl: "",
};
const dem = {
  localContentJsonUrl: "http://localhost:8090/2021/2021-DEM.json",
  publicContentJsonUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-DEM.json",
  prodPubContentJsonUrl: "https://publishing.dp-prod.aws.onsdigital.uk/visualisations/censusmapsconfig/2021-DEM.json",
  prodWebContentJsonUrl: "https://www.ons.gov.uk/visualisations/censusmapsconfig/2021-DEM.json",
  fakeDataBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE",
  realDataBaseUrl: "https://ons-dp-prod-census-maps-dem-mig.s3.eu-west-2.amazonaws.com",
};
const edu = {
  localContentJsonUrl: "http://localhost:8090/2021/2021-EDU.json",
  publicContentJsonUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-EDU.json",
  prodPubContentJsonUrl: "",
  prodWebContentJsonUrl: "",
  fakeDataBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE",
  realDataBaseUrl: "",
};
const eilr = {
  localContentJsonUrl: "http://localhost:8090/2021/2021-EILR.json",
  publicContentJsonUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-EILR.json",
  prodPubContentJsonUrl: "",
  prodWebContentJsonUrl: "",
  fakeDataBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE",
  realDataBaseUrl: "",
};
const hou = {
  localContentJsonUrl: "http://localhost:8090/2021/2021-HOU.json",
  publicContentJsonUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-HOU.json",
  prodPubContentJsonUrl: "",
  prodWebContentJsonUrl: "",
  fakeDataBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE",
  realDataBaseUrl: "",
};
const huc = {
  localContentJsonUrl: "http://localhost:8090/2021/2021-HUC.json",
  publicContentJsonUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-HUC.json",
  prodPubContentJsonUrl: "",
  prodWebContentJsonUrl: "",
  fakeDataBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE",
  realDataBaseUrl: "",
};
const lab = {
  localContentJsonUrl: "http://localhost:8090/2021/2021-LAB.json",
  publicContentJsonUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-LAB.json",
  prodPubContentJsonUrl: "",
  prodWebContentJsonUrl: "",
  fakeDataBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE",
  realDataBaseUrl: "",
};
const mig = {
  localContentJsonUrl: "http://localhost:8090/2021/2021-MIG.json",
  publicContentJsonUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-MIG.json",
  prodPubContentJsonUrl: "https://publishing.dp-prod.aws.onsdigital.uk/visualisations/censusmapsconfig/2021-MIG.json",
  prodWebContentJsonUrl: "https://www.ons.gov.uk/visualisations/censusmapsconfig/2021-MIG.json",
  fakeDataBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE",
  realDataBaseUrl: "https://ons-dp-prod-census-maps-dem-mig.s3.eu-west-2.amazonaws.com",
};
const sogi = {
  localContentJsonUrl: "http://localhost:8090/2021/2021-SOGI.json",
  publicContentJsonUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-SOGI.json",
  prodPubContentJsonUrl: "",
  prodWebContentJsonUrl: "",
  fakeDataBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE",
  realDataBaseUrl: "",
};
const ttw = {
  localContentJsonUrl: "http://localhost:8090/2021/2021-TTW.json",
  publicContentJsonUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-TTW.json",
  prodPubContentJsonUrl: "",
  prodWebContentJsonUrl: "",
  fakeDataBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE",
  realDataBaseUrl: "",
};

// envs / instances
export default {
  // local dev - use locally-served content json here to preview local changes to content. Real published data
  // and fake data for everything else
  dev: {
    publishing: [],
    web: [
      // zero is published
      {
        contentJsonUrl: zero.localContentJsonUrl,
        contentBaseUrl: zero.realDataBaseUrl,
      },
      // dem is published
      {
        contentJsonUrl: dem.localContentJsonUrl,
        contentBaseUrl: dem.realDataBaseUrl,
      },
      // edu is unpublished
      {
        contentJsonUrl: edu.localContentJsonUrl,
        contentBaseUrl: edu.fakeDataBaseUrl,
      },
      // eilr is unpublished
      {
        contentJsonUrl: eilr.localContentJsonUrl,
        contentBaseUrl: eilr.fakeDataBaseUrl,
      },
      // hou is unpublished
      {
        contentJsonUrl: hou.localContentJsonUrl,
        contentBaseUrl: hou.fakeDataBaseUrl,
      },
      // huc is unpublished
      {
        contentJsonUrl: huc.localContentJsonUrl,
        contentBaseUrl: huc.fakeDataBaseUrl,
      },
      // lab is unpublished
      {
        contentJsonUrl: lab.localContentJsonUrl,
        contentBaseUrl: lab.fakeDataBaseUrl,
      },
      // mig is published
      {
        contentJsonUrl: eilr.localContentJsonUrl,
        contentBaseUrl: eilr.realDataBaseUrl,
      },
      // sogi is unpublished
      {
        contentJsonUrl: sogi.localContentJsonUrl,
        contentBaseUrl: sogi.fakeDataBaseUrl,
      },
      // ttw is unpublished
      {
        contentJsonUrl: ttw.localContentJsonUrl,
        contentBaseUrl: ttw.fakeDataBaseUrl,
      },
    ],
  },

  // netlify - use public (s3) content json urls, load real published data and fake data for everything else
  netlify: {
    publishing: [],
    web: [
      // zero is published
      {
        contentJsonUrl: zero.publicContentJsonUrl,
        contentBaseUrl: zero.realDataBaseUrl,
      },
      // dem is published
      {
        contentJsonUrl: dem.publicContentJsonUrl,
        contentBaseUrl: dem.realDataBaseUrl,
      },
      // edu is unpublished
      {
        contentJsonUrl: edu.publicContentJsonUrl,
        contentBaseUrl: edu.fakeDataBaseUrl,
      },
      // eilr is unpublished
      {
        contentJsonUrl: eilr.publicContentJsonUrl,
        contentBaseUrl: eilr.fakeDataBaseUrl,
      },
      // hou is unpublished
      {
        contentJsonUrl: hou.publicContentJsonUrl,
        contentBaseUrl: hou.fakeDataBaseUrl,
      },
      // huc is unpublished
      {
        contentJsonUrl: huc.publicContentJsonUrl,
        contentBaseUrl: huc.fakeDataBaseUrl,
      },
      // lab is unpublished
      {
        contentJsonUrl: lab.publicContentJsonUrl,
        contentBaseUrl: lab.fakeDataBaseUrl,
      },
      // mig is published
      {
        contentJsonUrl: eilr.publicContentJsonUrl,
        contentBaseUrl: eilr.realDataBaseUrl,
      },
      // sogi is unpublished
      {
        contentJsonUrl: sogi.publicContentJsonUrl,
        contentBaseUrl: sogi.fakeDataBaseUrl,
      },
      // ttw is unpublished
      {
        contentJsonUrl: ttw.publicContentJsonUrl,
        contentBaseUrl: ttw.fakeDataBaseUrl,
      },
    ],
  },

  // ONS sandbox - use public (s3) content json urls, load real published data and fake data for everything else
  sandbox: {
    publishing: [],
    web: [
      // zero is published
      {
        contentJsonUrl: zero.publicContentJsonUrl,
        contentBaseUrl: zero.realDataBaseUrl,
      },
      // dem is published
      {
        contentJsonUrl: dem.publicContentJsonUrl,
        contentBaseUrl: dem.realDataBaseUrl,
      },
      // edu is unpublished
      {
        contentJsonUrl: edu.publicContentJsonUrl,
        contentBaseUrl: edu.fakeDataBaseUrl,
      },
      // eilr is unpublished
      {
        contentJsonUrl: eilr.publicContentJsonUrl,
        contentBaseUrl: eilr.fakeDataBaseUrl,
      },
      // hou is unpublished
      {
        contentJsonUrl: hou.publicContentJsonUrl,
        contentBaseUrl: hou.fakeDataBaseUrl,
      },
      // huc is unpublished
      {
        contentJsonUrl: huc.publicContentJsonUrl,
        contentBaseUrl: huc.fakeDataBaseUrl,
      },
      // lab is unpublished
      {
        contentJsonUrl: lab.publicContentJsonUrl,
        contentBaseUrl: lab.fakeDataBaseUrl,
      },
      // mig is published
      {
        contentJsonUrl: eilr.publicContentJsonUrl,
        contentBaseUrl: eilr.realDataBaseUrl,
      },
      // sogi is unpublished
      {
        contentJsonUrl: sogi.publicContentJsonUrl,
        contentBaseUrl: sogi.fakeDataBaseUrl,
      },
      // ttw is unpublished
      {
        contentJsonUrl: ttw.publicContentJsonUrl,
        contentBaseUrl: ttw.fakeDataBaseUrl,
      },
    ],
  },

  // ONS staging - unused at present
  staging: {
    publishing: [],
    web: [],
  },

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
  // ONS producution - only load published data / attempt to load prepublished data and load real data for everything
  prod: {
    // publishing uses the publishing (https://publishing.dp-prod.aws.onsdigital.uk) content json URLS and real data
    publishing: [
      {
        contentJsonUrl: zero.prodPubContentJsonUrl,
        contentBaseUrl: zero.realDataBaseUrl,
      },
      {
        contentJsonUrl: dem.prodPubContentJsonUrl,
        contentBaseUrl: dem.realDataBaseUrl,
      },
      {
        contentJsonUrl: mig.prodPubContentJsonUrl,
        contentBaseUrl: mig.realDataBaseUrl,
      },
    ],
    // web uses the web (ons.gov.uk) content JSON URLs for all published AND unpublished data (unpublished content json
    // will fail to load until publication time, but having prod web configured to always try and load them ensures they
    // appear instantly at publication time
    web: [
      {
        contentJsonUrl: zero.prodWebContentJsonUrl,
        contentBaseUrl: zero.realDataBaseUrl,
      },
      {
        contentJsonUrl: dem.prodWebContentJsonUrl,
        contentBaseUrl: dem.realDataBaseUrl,
      },
      {
        contentJsonUrl: mig.prodWebContentJsonUrl,
        contentBaseUrl: mig.realDataBaseUrl,
      },
    ],
  },
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
};
