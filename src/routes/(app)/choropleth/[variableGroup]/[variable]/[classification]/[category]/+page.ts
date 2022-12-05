import { redirect, type Load } from "@sveltejs/kit";
import { buildHyperlink } from "../../../../../../../helpers/buildHyperlinkHelper";

export const load: Load = ({ url, params }) => {
  redirectIfNecessary(url, params);
};

function redirectIfNecessary(url: URL, params: Partial<Record<string, string>>) {
  const match = redirects.find(
    (r) =>
      r.from[3] === params.category &&
      r.from[2] === params.classification &&
      r.from[1] === params.variable &&
      r.from[0] === params.variableGroup,
  );

  if (match) {
    const location = buildHyperlink(url, {
      variableGroup: params.variableGroup,
      variable: params.variable,
      category: {
        classification: params.classification,
        category: match.to,
      },
    });

    throw redirect(301, location);
  }
}

// add category name changes here
const redirects = [
  {
    from: ["population", "household-composition", "hh-family-composition-4a", "multiple-family-household"],
    to: "other-household-types",
  },
];
