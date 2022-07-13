import type topics from "./data/content";

export type GeoType = "ew" | "lad" | "msoa" | "oa" | string;

export type MapState = {
  bbox: Bbox;
  geoType: GeoType;
  zoom: number;
};

export type Topic = typeof topics[0];
export type Variable = typeof topics[0]["variables"][0];
export type Category = typeof topics[0]["variables"][0]["categories"][0];
export type VariableData = { [catCode: string]: { count: number; total: number; percentage: number } };

export type VizData = {
  geoType: GeoType;
  breaks: number[];
  minMaxVals: number[];
  places: { geoCode: string; ratioToTotal: number }[];
  params: {
    topic: Topic;
    variable: Variable;
    category: Category;
  };
};

export type SelectedGeographyData = {
  geoType: GeoType;
  geoCode: string;
  displayName: string;
  bbox: [number, number, number, number];
};

export type SelectedGeographyVariableData = {
  variableData: VariableData;
  englandAndWalesVariableData: VariableData;
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
    coordinates: [number, number, number, number];
  };
  properties?: any;
};

export type Bbox = {
  east: number;
  north: number;
  west: number;
  south: number;
};

export type LocaleSuggestions = [
  {
    label: string;
    topic: string;
    variable: string;
    category: string;
  },
];

export type DataTile = {
  tilename: string;
  bbox: Bbox;
};

export type DataTileGrid = {
  lad: DataTile[];
  msoa: DataTile[];
  oa: DataTile[];
};
