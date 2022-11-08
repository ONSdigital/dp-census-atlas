import content from "./content";

const publishedOrPrepublishedTopics = ["release-0", "dem", "mig"];

describe("content", () => {
  test("prod web contains the expected content only", () => {
    // !!! NB THIS TEST IS A SAFETY CATCH - UPDATE THE publishedTopics ARRAY AS NECCESSARY !!!
    let allPublished = true;
    publishedOrPrepublishedTopics.forEach((pt) => {
      const matchesPublishedTopic = content.prod.web.filter((t) => t.contentJsonUrl.toLowerCase().includes(pt));
      if (matchesPublishedTopic.length === 0) {
        allPublished = false;
      }
    });
    expect(allPublished).toEqual(true);
  });
  test("prod web contains only published prod content", () => {
    const nonPublishedNonProdContent = content.prod.web.filter((t) => {
      !t.contentJsonUrl.includes("ons.gov.uk") && !t.contentBaseUrl.includes("dp-prod");
    });
    expect(nonPublishedNonProdContent).toEqual([]);
  });
  test("prod web does not contain any blanks", () => {
    const blankContent = content.prod.web.filter((t) => {
      t.contentJsonUrl === "" || t.contentBaseUrl === "";
    });
    expect(blankContent).toEqual([]);
  });
  test("prod publishing does not contain any blanks", () => {
    const blankContent = content.prod.publishing.filter((t) => {
      t.contentJsonUrl === "" || t.contentBaseUrl === "";
    });
    expect(blankContent).toEqual([]);
  });
  test("dev does not contain prepublished prod data", () => {
    const prodPrePublishedContent = [
      ...content.dev.web.filter((t) => {
        !t.contentJsonUrl.includes("publishing.dp-prod");
      }),
      ...content.dev.publishing.filter((t) => {
        !t.contentJsonUrl.includes("publishing.dp-prod");
      }),
    ];
    expect(prodPrePublishedContent).toEqual([]);
  });
  test("netlify does not contain prepublished prod data", () => {
    const prodPrePublishedContent = [
      ...content.netlify.web.filter((t) => {
        !t.contentJsonUrl.includes("publishing.dp-prod");
      }),
      ...content.netlify.publishing.filter((t) => {
        !t.contentJsonUrl.includes("publishing.dp-prod");
      }),
    ];
    expect(prodPrePublishedContent).toEqual([]);
  });
  test("sandbox does not contain prepublished prod data", () => {
    const prodPrePublishedContent = [
      ...content.sandbox.web.filter((t) => {
        !t.contentJsonUrl.includes("publishing.dp-prod");
      }),
      ...content.sandbox.publishing.filter((t) => {
        !t.contentJsonUrl.includes("publishing.dp-prod");
      }),
    ];
    expect(prodPrePublishedContent).toEqual([]);
  });
  test("staging does not contain prepublished prod data", () => {
    const prodPrePublishedContent = [
      ...content.staging.web.filter((t) => {
        !t.contentJsonUrl.includes("publishing.dp-prod");
      }),
      ...content.staging.publishing.filter((t) => {
        !t.contentJsonUrl.includes("publishing.dp-prod");
      }),
    ];
    expect(prodPrePublishedContent).toEqual([]);
  });
});
