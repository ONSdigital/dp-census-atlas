import { appBasePath } from "../buildEnv";
import type { GeographySearchItem, PostcodeSearchItem } from "../types";

export const isSearchableQuery = (query: string): boolean => {
  return query.length >= 3;
};

export const fetchGeoPostcodeSearchItems = async (q: string): Promise<(GeographySearchItem | PostcodeSearchItem)[]> => {
  if (isSearchableQuery(q)) {
    const fetched = await Promise.all([fetchGeographySearchItems(q), fetchPostcodeSearchItems(q)]);
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
    const pcdPrefix = q.toUpperCase().replace(/\s/g, "").slice(0, 4);
    const response = await fetch(
      `https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/postcodeLkup/${pcdPrefix}.json`,
    );
    const json = await response.json();
    return json.map((postcode) => ({ kind: "Postcode", value: postcode.pcd, oa: postcode.oa }));
  } catch (err) {
    console.error(err);
    return [] as PostcodeSearchItem[];
  }
};
