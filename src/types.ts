import type topics from "./data/content";

export type GeoType = "lad" | "msoa";

export type MapState = {
  bbox: Bbox;
  geoType: GeoType;
};

export type Topic = typeof topics[0];
export type Variable = typeof topics[0]["variables"][0];
export type Category = typeof topics[0]["variables"][0]["categories"][0];

export type VizData = {
  breaks: number[];
  places: { geoCode: string; count: number; percentage: number; total: number }[];
  params: {
    topic: Topic;
    variable: Variable;
    category: Category;
  };
};

export type SelectedGeographyData = {
  displayName: string;
  geoCode: string;
  variableData: { [catCode: string]: { count: number; total: number; percentage: number } };
};

export type GeographyLookupProps = {
  meta: {
    name: string;
    code: string;
  };
  geo_json: GeographyGeo;
};

type GeographyGeo = {
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
