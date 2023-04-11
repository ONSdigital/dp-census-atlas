import { appBasePath } from "../buildEnv";
import type { GeographySearchItem, PostcodeSearchItem } from "../types";

const maxPostcodeResults = 10;

export const isSearchableQuery = (query: string): boolean => {
  return query.length >= 3;
};

export const fetchGeoPostcodeSearchItems = async (q: string): Promise<(GeographySearchItem | PostcodeSearchItem)[]> => {
  if (isSearchableQuery(q)) {
    const fetched = await Promise.all([fetchGeographySearchItems(q), fetchPostcodeSearchItems(q)]);
    console.log(fetched);
    return fetched.flat();
  }
  return [] as GeographySearchItem[];
};

const fetchGeographySearchItems = async (q: string): Promise<GeographySearchItem[]> => {
  try {
    const response = await fetch(`${appBasePath}/api/geo?q=${q}`);
    const json = await response.json();
    return json.map((geo) => ({ kind: "Geography", value: geo.en, ...geo }));
  } catch (err) {
    console.error(err);
    return [] as GeographySearchItem[];
  }
};

const fetchPostcodeSearchItems = async (q: string): Promise<PostcodeSearchItem[]> => {
  try {
    const pcdPrefix = q.toLowerCase();
    const response = await fetch(`https://api.postcodes.io/postcodes/${pcdPrefix}/autocomplete`);
    const json = await response.json();
    const postcodeResults = json.result.map((postcode) => ({ kind: "Postcode", value: postcode }));
    return filterPostcodeResults(q, postcodeResults);
  } catch (err) {
    console.error(err);
    return [] as PostcodeSearchItem[];
  }
};

export const fetchGeographyForPostcode = async (pcd: PostcodeSearchItem): Promise<GeographySearchItem> => {
  try {
    const response = await fetch(`https://api.postcodes.io/postcodes/${pcd.value}`);
    const json = await response.json();
    const code = json.result.codes.admin_district;
    const name = json.result.admin_district;
    const geo = {
      kind: "Geography",
      value: name,
      geoType: "LTLA",
      geoCode: code,
      en: name,
    };
    return geo as GeographySearchItem;
  } catch (err) {
    console.error(err);
  }
};

/*
  Filter postcodes to first ten matches for query string. Prioritise matches with the query string as the user typed it
  (after enforcing case) but if no matches found try to filter postcodes for the user query with spaces removed.
*/
const filterPostcodeResults = (q: string, postcodes: PostcodeSearchItem[]): PostcodeSearchItem[] => {
  const matchesOriginalQuery = postcodes
    .filter((pcd) => pcd.value.toUpperCase().includes(q.toUpperCase()))
    .slice(0, maxPostcodeResults);
  if (matchesOriginalQuery.length > 0) {
    return matchesOriginalQuery;
  }
  const matchesQueryWithSpacesRemoved = postcodes
    .filter((pcd) => pcd.value.toUpperCase().replace(/\s/g, "").includes(q.toUpperCase().replace(/\s/g, "")))
    .slice(0, maxPostcodeResults);
  return matchesQueryWithSpacesRemoved;
};
