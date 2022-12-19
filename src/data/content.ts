// define content resources (content json files and census data) loaded for different envs + instances of census maps

// topics
const zero = {
  localContentJsonUrl: "http://localhost:8090/release-0.json",
  publicContentJsonUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/release-0.json",
  prodPubContentJsonUrl: "https://publishing.dp-prod.aws.onsdigital.uk/visualisations/censusatlasdryrun/release-0.json",
  prodWebContentJsonUrl: "https://www.ons.gov.uk/visualisations/censusatlasdryrun/release-0.json",
  fakeDataBaseUrl: "no data to load",
  realDataBaseUrl: "no data to load",
};
const arm = {
  localContentJsonUrl: "http://localhost:8090/2021-ARM.json",
  publicContentJsonUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-ARM.json",
  prodPubContentJsonUrl: "https://publishing.dp-prod.aws.onsdigital.uk/visualisations/censusmapsconfig/2021-ARM.json",
  prodWebContentJsonUrl: "https://www.ons.gov.uk/visualisations/censusmapsconfig/2021-ARM.json",
  fakeDataBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021",
  realDataBaseUrl: "https://ons-dp-prod-census-maps-arm.s3.eu-west-2.amazonaws.com",
};
const dem = {
  localContentJsonUrl: "http://localhost:8090/2021-DEM.json",
  publicContentJsonUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-DEM.json",
  prodPubContentJsonUrl: "https://publishing.dp-prod.aws.onsdigital.uk/visualisations/censusmapsconfig/2021-DEM.json",
  prodWebContentJsonUrl: "https://www.ons.gov.uk/visualisations/censusmapsconfig/2021-DEM.json",
  fakeDataBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021",
  realDataBaseUrl: "https://ons-dp-prod-census-maps-dem-mig.s3.eu-west-2.amazonaws.com",
};
const edu = {
  localContentJsonUrl: "http://localhost:8090/2021-EDU.json",
  publicContentJsonUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-EDU.json",
  prodPubContentJsonUrl:
    "https://publishing.dp-prod.aws.onsdigital.uk/visualisations/censusmapsconfigedu/2021-EDU.json",
  prodWebContentJsonUrl: "https://www.ons.gov.uk/visualisations/censusmapsconfigedu/2021-EDU.json",
  fakeDataBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021",
  realDataBaseUrl: "https://ons-dp-prod-census-maps-edu.s3.eu-west-2.amazonaws.com",
};
const eilr = {
  localContentJsonUrl: "http://localhost:8090/2021-EILR.json",
  publicContentJsonUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-EILR.json",
  prodPubContentJsonUrl: "https://publishing.dp-prod.aws.onsdigital.uk/visualisations/censusmapsconfig/2021-EILR.json",
  prodWebContentJsonUrl: "https://www.ons.gov.uk/visualisations/censusmapsconfig/2021-EILR.json",
  fakeDataBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021",
  realDataBaseUrl: "https://ons-dp-prod-census-maps-eilr.s3.eu-west-2.amazonaws.com",
};
const hou = {
  localContentJsonUrl: "http://localhost:8090/2021-HOU.json",
  publicContentJsonUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-HOU.json",
  prodPubContentJsonUrl:
    "https://publishing.dp-prod.aws.onsdigital.uk/visualisations/censusmapsconfighou/2021-HOU.json",
  prodWebContentJsonUrl: "https://www.ons.gov.uk/visualisations/censusmapsconfighou/2021-HOU.json",
  fakeDataBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021",
  realDataBaseUrl: "https://ons-dp-prod-census-maps-hou.s3.eu-west-2.amazonaws.com",
};
const huc = {
  localContentJsonUrl: "http://localhost:8090/2021-HUC.json",
  publicContentJsonUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-HUC.json",
  prodPubContentJsonUrl:
    "https://publishing.dp-prod.aws.onsdigital.uk/visualisations/censusmapsconfighuc2/2021-HUC.json",
  prodWebContentJsonUrl: "https://www.ons.gov.uk/visualisations/censusmapsconfighuc2/2021-HUC.json",
  fakeDataBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021",
  realDataBaseUrl: "https://ons-dp-prod-census-maps-huc.s3.eu-west-2.amazonaws.com",
};
const lab = {
  localContentJsonUrl: "http://localhost:8090/2021-LAB.json",
  publicContentJsonUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-LAB.json",
  prodPubContentJsonUrl:
    "https://publishing.dp-prod.aws.onsdigital.uk/visualisations/censusmapsconfiglab/2021-LAB.json",
  prodWebContentJsonUrl: "https://www.ons.gov.uk/visualisations/censusmapsconfiglab/2021-LAB.json",
  fakeDataBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021",
  realDataBaseUrl: "https://ons-dp-prod-census-maps-lab.s3.eu-west-2.amazonaws.com",
};
const mig = {
  localContentJsonUrl: "http://localhost:8090/2021-MIG.json",
  publicContentJsonUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-MIG.json",
  prodPubContentJsonUrl: "https://publishing.dp-prod.aws.onsdigital.uk/visualisations/censusmapsconfig/2021-MIG.json",
  prodWebContentJsonUrl: "https://www.ons.gov.uk/visualisations/censusmapsconfig/2021-MIG.json",
  fakeDataBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021",
  realDataBaseUrl: "https://ons-dp-prod-census-maps-dem-mig.s3.eu-west-2.amazonaws.com",
};
const sogi = {
  localContentJsonUrl: "http://localhost:8090/2021-SOGI.json",
  publicContentJsonUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-SOGI.json",
  prodPubContentJsonUrl:
    "https://publishing.dp-prod.aws.onsdigital.uk/visualisations/censusmapsconfigsogi/2021-SOGI.json",
  prodWebContentJsonUrl: "https://www.ons.gov.uk/visualisations/censusmapsconfigsogi/2021-SOGI.json",
  fakeDataBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021",
  realDataBaseUrl: "https://ons-dp-prod-census-maps-sogi.s3.eu-west-2.amazonaws.com",
};
const ttw = {
  localContentJsonUrl: "http://localhost:8090/2021-TTW.json",
  publicContentJsonUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-TTW.json",
  prodPubContentJsonUrl:
    "https://publishing.dp-prod.aws.onsdigital.uk/visualisations/censusmapsconfiglab/2021-TTW.json",
  prodWebContentJsonUrl: "https://www.ons.gov.uk/visualisations/censusmapsconfiglab/2021-TTW.json",
  fakeDataBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021",
  realDataBaseUrl: "https://ons-dp-prod-census-maps-ttw.s3.eu-west-2.amazonaws.com",
};
const welshSkills = {
  localContentJsonUrl: "http://localhost:8090/2021-WELSH-SKILLS.json",
  publicContentJsonUrl:
    "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/content-json/2021/2021-WELSH-SKILLS.json",
  prodPubContentJsonUrl:
    "https://publishing.dp-prod.aws.onsdigital.uk/visualisations/censusmapsconfiglab/2021-WELSH-SKILLS.json",
  prodWebContentJsonUrl: "https://www.ons.gov.uk/visualisations/censusmapsconfiglab/2021-WELSH-SKILLS.json",
  fakeDataBaseUrl: "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2021",
  realDataBaseUrl: "https://ons-dp-prod-census-maps-welsh-skills.s3.eu-west-2.amazonaws.com",
};

// envs / instances
export default {
  // local dev - use locally-served content json here to preview local changes to content. Real published data
  // and fake data for everything else
  dev: {
    publishing: [],
    web: [
<<<<<<< HEAD
      // // zero is published
=======
      // zero is published
>>>>>>> 58e275d (update 2011 comparison data availability)
      {
        contentJsonUrl: zero.localContentJsonUrl,
        contentBaseUrl: zero.realDataBaseUrl,
      },
      // arm is published
      {
        contentJsonUrl: arm.localContentJsonUrl,
        contentBaseUrl: arm.realDataBaseUrl,
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
      // eilr is published
      {
        contentJsonUrl: eilr.localContentJsonUrl,
        contentBaseUrl: eilr.realDataBaseUrl,
      },
<<<<<<< HEAD
      // hou is published
      {
        contentJsonUrl: hou.localContentJsonUrl,
        contentBaseUrl: hou.realDataBaseUrl,
=======
      // hou is unpublished
      {
        contentJsonUrl: hou.localContentJsonUrl,
        contentBaseUrl: hou.fakeDataBaseUrl,
>>>>>>> 58e275d (update 2011 comparison data availability)
      },
      // huc is unpublished
      {
        contentJsonUrl: huc.localContentJsonUrl,
        contentBaseUrl: huc.fakeDataBaseUrl,
      },
<<<<<<< HEAD
      // lab is published
      {
        contentJsonUrl: lab.localContentJsonUrl,
        contentBaseUrl: lab.realDataBaseUrl,
=======
      // lab is unpublished
      {
        contentJsonUrl: lab.localContentJsonUrl,
        contentBaseUrl: lab.fakeDataBaseUrl,
>>>>>>> 58e275d (update 2011 comparison data availability)
      },
      // mig is published
      {
        contentJsonUrl: mig.localContentJsonUrl,
        contentBaseUrl: mig.realDataBaseUrl,
      },
<<<<<<< HEAD
      // sogi is published
      {
        contentJsonUrl: sogi.localContentJsonUrl,
        contentBaseUrl: sogi.realDataBaseUrl,
      },
      // ttw is published
      {
        contentJsonUrl: ttw.localContentJsonUrl,
        contentBaseUrl: ttw.realDataBaseUrl,
      },
      // welshSkills is published
      {
        contentJsonUrl: welshSkills.localContentJsonUrl,
        contentBaseUrl: welshSkills.realDataBaseUrl,
=======
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
      // welshSkills is unpublished
      {
        contentJsonUrl: welshSkills.localContentJsonUrl,
        contentBaseUrl: welshSkills.fakeDataBaseUrl,
>>>>>>> 58e275d (update 2011 comparison data availability)
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
      // arm is published
      {
        contentJsonUrl: arm.publicContentJsonUrl,
        contentBaseUrl: arm.realDataBaseUrl,
      },
      // dem is published
      {
        contentJsonUrl: dem.publicContentJsonUrl,
        contentBaseUrl: dem.realDataBaseUrl,
      },
<<<<<<< HEAD
      // edu is published
      {
        contentJsonUrl: edu.publicContentJsonUrl,
        contentBaseUrl: edu.realDataBaseUrl,
=======
      // edu is unpublished
      {
        contentJsonUrl: edu.publicContentJsonUrl,
        contentBaseUrl: edu.fakeDataBaseUrl,
>>>>>>> 58e275d (update 2011 comparison data availability)
      },
      // eilr is published
      {
        contentJsonUrl: eilr.publicContentJsonUrl,
        contentBaseUrl: eilr.realDataBaseUrl,
      },
<<<<<<< HEAD
      // hou is published
      {
        contentJsonUrl: hou.publicContentJsonUrl,
        contentBaseUrl: hou.realDataBaseUrl,
=======
      // hou is unpublished
      {
        contentJsonUrl: hou.publicContentJsonUrl,
        contentBaseUrl: hou.fakeDataBaseUrl,
>>>>>>> 58e275d (update 2011 comparison data availability)
      },
      // huc is unpublished
      {
        contentJsonUrl: huc.publicContentJsonUrl,
        contentBaseUrl: huc.fakeDataBaseUrl,
      },
<<<<<<< HEAD
      // lab is published
      {
        contentJsonUrl: lab.publicContentJsonUrl,
        contentBaseUrl: lab.realDataBaseUrl,
=======
      // lab is unpublished
      {
        contentJsonUrl: lab.publicContentJsonUrl,
        contentBaseUrl: lab.fakeDataBaseUrl,
>>>>>>> 58e275d (update 2011 comparison data availability)
      },
      // mig is published
      {
        contentJsonUrl: mig.publicContentJsonUrl,
        contentBaseUrl: mig.realDataBaseUrl,
      },
<<<<<<< HEAD
      // sogi is published
      {
        contentJsonUrl: sogi.publicContentJsonUrl,
        contentBaseUrl: sogi.realDataBaseUrl,
      },
      // ttw is published
      {
        contentJsonUrl: ttw.publicContentJsonUrl,
        contentBaseUrl: ttw.realDataBaseUrl,
      },
      // welshSkills is published
      {
        contentJsonUrl: welshSkills.publicContentJsonUrl,
        contentBaseUrl: welshSkills.realDataBaseUrl,
=======
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
      // welshSkills is unpublished
      {
        contentJsonUrl: welshSkills.publicContentJsonUrl,
        contentBaseUrl: welshSkills.fakeDataBaseUrl,
>>>>>>> 58e275d (update 2011 comparison data availability)
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
      // arm is published
      {
        contentJsonUrl: arm.publicContentJsonUrl,
        contentBaseUrl: arm.realDataBaseUrl,
      },
      // dem is published
      {
        contentJsonUrl: dem.publicContentJsonUrl,
        contentBaseUrl: dem.realDataBaseUrl,
      },
      // edu is published
      {
        contentJsonUrl: edu.publicContentJsonUrl,
        contentBaseUrl: edu.realDataBaseUrl,
      },
      // eilr is published
      {
        contentJsonUrl: eilr.publicContentJsonUrl,
        contentBaseUrl: eilr.realDataBaseUrl,
      },
      // hou is published
      {
        contentJsonUrl: hou.publicContentJsonUrl,
        contentBaseUrl: hou.realDataBaseUrl,
      },
      // huc is unpublished
      {
        contentJsonUrl: huc.publicContentJsonUrl,
        contentBaseUrl: huc.fakeDataBaseUrl,
      },
      // lab is published
      {
        contentJsonUrl: lab.publicContentJsonUrl,
        contentBaseUrl: lab.realDataBaseUrl,
      },
      // mig is published
      {
        contentJsonUrl: mig.publicContentJsonUrl,
        contentBaseUrl: mig.realDataBaseUrl,
      },
      // sogi is published
      {
        contentJsonUrl: sogi.publicContentJsonUrl,
        contentBaseUrl: sogi.realDataBaseUrl,
      },
      // ttw is published
      {
        contentJsonUrl: ttw.publicContentJsonUrl,
        contentBaseUrl: ttw.realDataBaseUrl,
      },
      // welshSkills is published
      {
        contentJsonUrl: welshSkills.publicContentJsonUrl,
        contentBaseUrl: welshSkills.realDataBaseUrl,
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
        contentJsonUrl: arm.prodPubContentJsonUrl,
        contentBaseUrl: arm.realDataBaseUrl,
      },
      {
        contentJsonUrl: dem.prodPubContentJsonUrl,
        contentBaseUrl: dem.realDataBaseUrl,
      },
      {
        contentJsonUrl: edu.prodPubContentJsonUrl,
        contentBaseUrl: edu.realDataBaseUrl,
      },
      {
        contentJsonUrl: eilr.prodPubContentJsonUrl,
        contentBaseUrl: eilr.realDataBaseUrl,
      },
      {
        contentJsonUrl: hou.prodPubContentJsonUrl,
        contentBaseUrl: hou.realDataBaseUrl,
      },
      {
        contentJsonUrl: huc.prodPubContentJsonUrl,
        contentBaseUrl: huc.realDataBaseUrl,
      },
      {
        contentJsonUrl: lab.prodPubContentJsonUrl,
        contentBaseUrl: lab.realDataBaseUrl,
      },
      {
        contentJsonUrl: mig.prodPubContentJsonUrl,
        contentBaseUrl: mig.realDataBaseUrl,
      },
      {
        contentJsonUrl: sogi.prodPubContentJsonUrl,
        contentBaseUrl: sogi.realDataBaseUrl,
      },
      {
        contentJsonUrl: ttw.prodPubContentJsonUrl,
        contentBaseUrl: ttw.realDataBaseUrl,
      },
      {
        contentJsonUrl: welshSkills.prodPubContentJsonUrl,
        contentBaseUrl: welshSkills.realDataBaseUrl,
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
        contentJsonUrl: arm.prodWebContentJsonUrl,
        contentBaseUrl: arm.realDataBaseUrl,
      },
      {
        contentJsonUrl: dem.prodWebContentJsonUrl,
        contentBaseUrl: dem.realDataBaseUrl,
      },
      {
        contentJsonUrl: edu.prodWebContentJsonUrl,
        contentBaseUrl: edu.realDataBaseUrl,
      },
      {
        contentJsonUrl: eilr.prodWebContentJsonUrl,
        contentBaseUrl: eilr.realDataBaseUrl,
      },
      {
        contentJsonUrl: hou.prodWebContentJsonUrl,
        contentBaseUrl: hou.realDataBaseUrl,
      },
      {
        contentJsonUrl: huc.prodWebContentJsonUrl,
        contentBaseUrl: huc.realDataBaseUrl,
      },
      {
        contentJsonUrl: lab.prodWebContentJsonUrl,
        contentBaseUrl: lab.realDataBaseUrl,
      },
      {
        contentJsonUrl: mig.prodWebContentJsonUrl,
        contentBaseUrl: mig.realDataBaseUrl,
      },
      {
        contentJsonUrl: sogi.prodWebContentJsonUrl,
        contentBaseUrl: sogi.realDataBaseUrl,
      },
      {
        contentJsonUrl: ttw.prodWebContentJsonUrl,
        contentBaseUrl: ttw.realDataBaseUrl,
      },
      {
        contentJsonUrl: welshSkills.prodWebContentJsonUrl,
        contentBaseUrl: welshSkills.realDataBaseUrl,
      },
    ],
  },
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
};
