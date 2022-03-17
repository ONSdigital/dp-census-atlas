import topics from '../data/content';

export const getCodesForCategory = (
  topicSlug: string,
  variableSlug: string,
  classificationSlug: string,
  categorySlug: string,
) => {
  let topic = topics.find((t) => t.slug === topicSlug);
  let variable = topic.variables.find((v) => v.slug === variableSlug);
  let classification = {
    name: "Default",
    desc: "Default classification",
    categories: variable.categories,
  };
  let category = variable.categories.find((c) => c.slug === categorySlug);

  return {
    totalCode: variable.total.code,
    categoryCode: category.code,
    categoryCodes: variable.categories.map((c) => c.code),
  };
};

export const getCategoryInfo = (categoryCode: string) => {
  let allVariables = topics.flatMap((t) => t.variables.map((v) => ({ topic: t, variable: v })));
  let allCategories = allVariables.flatMap((v) =>
    v.variable.categories.map((c) => ({ topic: v.topic, category: c, variable: v })),
  );
  let match = allCategories.find((c) => c.category.code === categoryCode);

  return {
    topic: match.topic,
    variable: match.variable.variable,
    category: match.category,
  };
};
