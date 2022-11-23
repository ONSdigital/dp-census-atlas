import content from "./content";

const publishedOrPrepublishedTopics = ["release-0", "arm", "dem", "eilr", "lab", "mig", "ttw", "welsh-skills"];

describe("content", () => {
  test("prod web contains the expected content only", () => {
    // !!! NB THIS TEST IS A SAFETY CATCH - UPDATE THE publishedOrPrepublishedTopics ARRAY AS NECCESSARY !!!
    let allProdWebTopicsArePublished = true;
    // each prod web content json url must match one of the publishedOrPrepublishedTopics
    const prodWebContentJsonURLs = content.prod.web.map((t) => t.contentJsonUrl.toLowerCase());
    prodWebContentJsonURLs.forEach((contentJsonUrl) => {
      let thisProdWebTopicIsPublished = false;
      publishedOrPrepublishedTopics.forEach((t) => {
        if (contentJsonUrl.includes(t)) {
          thisProdWebTopicIsPublished = true;
        }
      });
      if (thisProdWebTopicIsPublished === false) {
        allProdWebTopicsArePublished = false;
      }
    });
    expect(allProdWebTopicsArePublished).toEqual(true);
  });
  test("prod web contains only published prod content", () => {
    const nonPublishedNonProdContent = content.prod.web.filter((t) => {
      !t.contentJsonUrl.includes("ons.gov.uk") && !t.contentBaseUrl.includes("dp-prod");
    });
    expect(nonPublishedNonProdContent).toEqual([]);
  });
  test("prod web does not contain any blanks", () => {
    const blankContent = content.prod.web.filter((t) => {
      return t.contentJsonUrl === "" || t.contentBaseUrl === "";
    });
    expect(blankContent).toEqual([]);
  });
  test("prod publishing does not contain any blanks", () => {
    const blankContent = content.prod.publishing.filter((t) => {
      return t.contentJsonUrl === "" || t.contentBaseUrl === "";
    });
    expect(blankContent).toEqual([]);
  });
  test("dev does not contain prepublished prod data", () => {
    const prodPrePublishedContent = [
      ...content.dev.web.filter((t) => {
        return t.contentJsonUrl.includes("publishing.dp-prod");
      }),
      ...content.dev.publishing.filter((t) => {
        return t.contentJsonUrl.includes("publishing.dp-prod");
      }),
    ];
    expect(prodPrePublishedContent).toEqual([]);
  });
  test("netlify does not contain prepublished prod data", () => {
    const prodPrePublishedContent = [
      ...content.netlify.web.filter((t) => {
        return t.contentJsonUrl.includes("publishing.dp-prod");
      }),
      ...content.netlify.publishing.filter((t) => {
        return t.contentJsonUrl.includes("publishing.dp-prod");
      }),
    ];
    expect(prodPrePublishedContent).toEqual([]);
  });
  test("sandbox does not contain prepublished prod data", () => {
    const prodPrePublishedContent = [
      ...content.sandbox.web.filter((t) => {
        return t.contentJsonUrl.includes("publishing.dp-prod");
      }),
      ...content.sandbox.publishing.filter((t) => {
        return t.contentJsonUrl.includes("publishing.dp-prod");
      }),
    ];
    expect(prodPrePublishedContent).toEqual([]);
  });
  test("staging does not contain prepublished prod data", () => {
    const prodPrePublishedContent = [
      ...content.staging.web.filter((t) => {
        return t.contentJsonUrl.includes("publishing.dp-prod");
      }),
      ...content.staging.publishing.filter((t) => {
        return t.contentJsonUrl.includes("publishing.dp-prod");
      }),
    ];
    expect(prodPrePublishedContent).toEqual([]);
  });
});
