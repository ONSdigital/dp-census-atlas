import type topics from "./data/content";

export type GeoType = "ew" | "lad" | "msoa" | string;

export type MapState = {
  bbox: Bbox;
  geoType: GeoType;
};

export type Topic = typeof topics[0];
export type Variable = typeof topics[0]["variables"][0];
export type Category = typeof topics[0]["variables"][0]["categories"][0];
export type VariableData = { [catCode: string]: { count: number; total: number; percentage: number } };

export type VizData = {
  breaks: number[];
  places: { geoCode: string; count: number; percentage: number; total: number }[];
  params: {
    topic: Topic;
    variable: Variable;
    category: Category;
  };
  variableData?: VariableData;
  defaultGeoVariableData?: VariableData;
};

export type SelectedGeographyData = {
  geoType: GeoType;
  geoCode: string;
  displayName: string;
  bbox: [number, number, number, number];
  allHouseholdsTotal: number;
  allPeopleTotal: number;
};

export type GeographyAutoSuggestProps = {
  bbox: number[];
  cy: string;
  en: string;
  geoCode: string;
  geoType: string;
  sanitisedText?: string;
};

export type GeographyInfo = {
  meta: {
    name: string;
    code: string;
    geotype: string;
  };
  geo_json: GeographyGeojson;
};

type GeographyGeojson = {
  type: string;
  features: GeographyFeatures[];
};

type GeographyFeatures = {
  type: string;
  id: string;
  geometry: {
    type: string;
    coordinates: (number[][] | number[] | number)[];
  };
  properties?: any;
};

export type Bbox = {
  east: number;
  north: number;
  west: number;
  south: number;
};
