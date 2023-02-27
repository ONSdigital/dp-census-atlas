import { redirect } from "@sveltejs/kit";

export const redirectIfNecessary = (url: URL) => {
  const match = redirects.find((r) => url.pathname.includes(r.old));
  if (match) {
    const location = new URL(url);
    location.pathname = url.pathname.replace(match.old, match.new);
    throw redirect(301, location.toString());
  }
};

// add redirects here
// let's try to keep them in alphabetical order (by the old URL!)
export const redirects = [
  {
    old: "/identity/multiple-religions-in-household/hh-multi-religion-7a/multi-person-household-no-people-stated-their-religion",
    new: "/identity/multiple-religions-in-household/hh-multi-religion-7a/multi-person-household-no-people-answered-the-religion-question",
  },
  {
    old: "/identity/multiple-religions-in-household/hh-multi-religion-7a/multi-person-household-same-religion-at-least-one-person-has-stated-a-religion-but-the-household-may-include-people-who-did-not-state-their-religion",
    new: "/identity/multiple-religions-in-household/hh-multi-religion-7a/multi-person-household-same-religion-at-least-one-person-has-stated-a-religion-but-the-household-may-include-people-who-did-not-answer-the-religion-question",
  },
  {
    old: "/identity/multiple-religions-in-household/hh-multi-religion-7a/multi-person-household-no-religion-household-may-include-people-who-did-not-state-their-religion",
    new: "/identity/multiple-religions-in-household/hh-multi-religion-7a/multi-person-household-no-religion-household-may-include-people-who-did-not-answer-the-religion-question",
  },
  {
    old: "/identity/multiple-religions-in-household/hh-multi-religion-7a/multi-person-household-same-religion-and-no-religion-household-may-include-people-who-did-not-state-their-religion",
    new: "/identity/multiple-religions-in-household/hh-multi-religion-7a/multi-person-household-same-religion-and-no-religion-household-may-include-people-who-did-not-answer-the-religion-question",
  },
  {
    old: "/identity/multiple-religions-in-household/hh-multi-religion-7a/multi-person-household-at-least-two-different-religions-stated-household-may-include-people-with-no-religion-and-who-did-not-state-their-religion",
    new: "/identity/multiple-religions-in-household/hh-multi-religion-7a/multi-person-household-at-least-two-different-religions-stated-household-may-include-people-with-no-religion-and-who-did-not-answer-the-religion-question",
  },
  {
    old: "/population/household-composition/hh-family-composition-4a/multiple-family-household",
    new: "/population/household-composition/hh-family-composition-4a/other-household-types",
  },
  {
    old: "/population/living-arrangements/living-arrangements-11a/not-living-in-a-couple-single-never-married-and-never-registered-a-same-sex-civil-partnership",
    new: "/population/living-arrangements/living-arrangements-11a/not-living-in-a-couple-single-never-married-and-never-registered-a-civil-partnership",
  },
  {
    old: "/population/uk-armed-forces-veteran-indicator/uk-armed-forces/previously-served-in-uk-armed-forces",
    new: "/population/uk-armed-forces-veteran-indicator/uk-armed-forces/previously-served-in-the-uk-regular-armed-forces",
  },
  {
    old: "/work/unemployment-history",
    new: "/work/employment-history",
  },
];
