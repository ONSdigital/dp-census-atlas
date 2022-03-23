import topics from "../data/content";

export const searchCensus = (q: string) => {
  const s = q.toLowerCase();

  const topicResults = topics.filter((t) => t.name.toLowerCase().includes(s) || t.desc.toLowerCase().includes(s));

  const allVariables = topics.flatMap((t) => t.variables.map((v) => ({ topic: t, variable: v })));
  const variableResults = allVariables.filter(
    (v) => v.variable.name.toLowerCase().includes(s) || v.variable.desc.toLowerCase().includes(s),
  );

  const allCategories = allVariables.flatMap((v) =>
    v.variable.categories.map((c) => ({ topic: v.topic, category: c, variable: v })),
  );
  const categoryResults = allCategories.filter(
    (c) => c.category.name.toLowerCase().includes(s), // || c.desc.toLowerCase().includes(s)
  );

  return {
    topics: topicResults,
    variables: variableResults,
    categories: categoryResults,
  };
};

export const highlightText = (text: string, q: string) => {
  return text.replace(new RegExp(q, "gi"), '<mark class="tw-mark">$&</mark>');
};
