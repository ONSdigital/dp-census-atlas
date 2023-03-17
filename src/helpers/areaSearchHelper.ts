import { appBasePath } from "../buildEnv";
import type { GeographySearchItem, PostcodeSearchItem } from "../types";

export const isSearchableQuery = (query: string): boolean => {
  return query.length >= 4;
};

export const fetchGeoPostcodeSearchItems = async (q: string): Promise<(GeographySearchItem | PostcodeSearchItem)[]> => {
  if (isSearchableQuery(q)) {
    const fetched = await fetchGeographySearchItems(q);
    return fetched;
  }
  return [] as GeographySearchItem[];
};

const fetchGeographySearchItems = async (q: string): Promise<GeographySearchItem[]> => {
  try {
    const response = await fetch(`${appBasePath}/api/geo?q=${q}`);
    if (response.status !== 200) {
      console.error(response.body);
      return [] as GeographySearchItem[];
    }
    const json = await response.json();
    return json.map((geo) => ({ kind: "Geography", value: geo.en, ...geo }));
  } catch (err) {
    console.error(err);
    return [] as GeographySearchItem[];
  }
};
