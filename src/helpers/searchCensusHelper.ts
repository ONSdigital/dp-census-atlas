import type { VariableGroup } from "src/types";

export const searchCensus = (q: string, variableGroups: VariableGroup[]) => {
  if (!variableGroups) {
    return {
      variableGroups: [],
      variables: [],
      categories: [],
    };
  }
  const s = q.toLowerCase();
  const variableGroupResults = variableGroups.filter(
    (vg) => vg.name.toLowerCase().includes(s) || vg.desc.toLowerCase().includes(s),
  );

  const allVariables = variableGroups.flatMap((vg) => vg.variables.map((v) => ({ variableGroup: vg, variable: v })));
  const variableResults = allVariables.filter(
    (v) => v.variable.name.toLowerCase().includes(s) || v.variable.desc.toLowerCase().includes(s),
  );

  const allClassifications = allVariables.flatMap((v) =>
    v.variable.classifications.map((c) => ({ variableGroup: v.variableGroup, variable: v, classification: c })),
  );

  const allCategories = allClassifications.flatMap((c) =>
    c.classification.categories.map((cat) => ({
      variableGroup: c.variableGroup,
      variable: c.variable,
      classification: c,
      category: cat,
    })),
  );
  const categoryResults = allCategories.filter(
    (c) => c.category.name.toLowerCase().includes(s), // || c.desc.toLowerCase().includes(s)
  );

  return {
    variableGroups: variableGroupResults,
    variables: variableResults,
    categories: categoryResults,
  };
};

export const highlightText = (text: string, q: string) => {
  return text.replace(new RegExp(q, "gi"), '<mark class="mark">$&</mark>');
};
