export const searchCensus = (q: string, topics) => {
  if (!topics) {
    return {
      topics: [],
      variables: [],
      categories: [],
    };
  }
  const s = q.toLowerCase();
  const topicResults = topics.filter((t) => t.name.toLowerCase().includes(s) || t.desc.toLowerCase().includes(s));

  const allVariables = topics.flatMap((t) => t.variables.map((v) => ({ topic: t, variable: v })));
  const variableResults = allVariables.filter(
    (v) => v.variable.name.toLowerCase().includes(s) || v.variable.desc.toLowerCase().includes(s),
  );

  const allClassifications = allVariables.flatMap((v) =>
    v.variable.classifications.map((c) => ({ topic: v.topic, variable: v, classification: c })),
  );

  const allCategories = allClassifications.flatMap((c) =>
    c.classification.categories.map((cat) => ({
      topic: c.topic,
      variable: c.variable,
      classification: c,
      category: cat,
    })),
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
  return text.replace(new RegExp(q, "gi"), '<mark class="mark">$&</mark>');
};
