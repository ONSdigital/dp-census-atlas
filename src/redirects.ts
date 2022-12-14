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
    old: "/population/household-composition/hh-family-composition-4a/multiple-family-household",
    new: "/population/household-composition/hh-family-composition-4a/other-household-types",
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
