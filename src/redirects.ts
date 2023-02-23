import { redirect } from "@sveltejs/kit";

const isRedirectMatch = (urlPathIn: string, urlPathRedirect: string): boolean => {
  // match if the split components of urlPathIn match their equivalents in urlPathRedirect
  const urlPathInComponents = urlPathIn.split("/");
  const urlPathRedirectComponents = urlPathRedirect.split("/");
  for (const [i, c] of urlPathRedirectComponents.entries()) {
    if (urlPathInComponents[i] != c) {
      return false;
    }
  }
  return true;
};

export const redirectIfNecessary = (url: URL) => {
  const match = redirects.find((r) => isRedirectMatch(url.pathname, r.old));
  if (match) {
    console.log(match);
    const location = new URL(url);
    location.pathname = url.pathname.replace(match.old, match.new);
    throw redirect(301, location.toString());
  }
};

// add redirects here
// let's try to keep them in alphabetical order (by the old URL!)
export const redirects = [
  {
    old: "/change/housing/accommodation-type/accommodation-type/part-of-another-converted-building-for-example-former-school-church-or-warehouse",
    new: "/change/housing/accommodation-type/accommodation-type/in-a-commercial-building-for-example-in-an-office-building-hotel-or-over-a-shop",
  },
  {
    old: "/change/housing/second-address-type/second-address-type-priority/partner-s-address",
    new: "/change/housing/second-address-type/second-address-type-priority/other",
  },
  {
    old: "/change/identity/national-identity-detailed/national-identity-detailed/other-identity-only-middle-eastern-and-asian-middle-eastern-kurdish",
    new: "/change/identity/national-identity-detailed/national-identity-detailed/other-identity-only-middle-eastern-and-asian-middle-eastern-other-middle-eastern",
  },
  {
    old: "/change/population/legal-partnership-status/legal-partnership-status/in-a-registered-civil-partnership-opposite-sex",
    new: "/change/population/legal-partnership-status/legal-partnership-status/in-a-registered-civil-partnership",
  },
  {
    old: "/change/population/legal-partnership-status/legal-partnership-status/in-a-registered-civil-partnership-same-sex",
    new: "/change/population/legal-partnership-status/legal-partnership-status/in-a-registered-civil-partnership",
  },
  {
    old: "/choropleth/population/legal-partnership-status/legal-partnership-status/in-a-registered-civil-partnership",
    new: "/choropleth/population/legal-partnership-status/legal-partnership-status/in-a-registered-civil-partnership-same-sex",
  },
  {
    old: "/change/population/legal-partnership-status/legal-partnership-status/married-opposite-sex",
    new: "/change/population/legal-partnership-status/legal-partnership-status/married",
  },
  {
    old: "/change/population/legal-partnership-status/legal-partnership-status/married-same-sex",
    new: "/change/population/legal-partnership-status/legal-partnership-status/married",
  },
  {
    old: "/choropleth/population/legal-partnership-status/legal-partnership-status/married",
    new: "/choropleth/population/legal-partnership-status/legal-partnership-status/married-opposite-sex",
  },
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
