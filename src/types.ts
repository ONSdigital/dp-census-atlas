export const GeoTypes = ["ew", "lad", "msoa", "oa"];
export type GeoType = typeof GeoTypes[number];

export type MapState = {
  bbox: Bbox;
  geoType: GeoType;
  zoom: number;
};

export type Topic = {
  name: string;
  slug: string;
  desc: string;
  variables: [Variable];
};
export type Variable = {
  name: string;
  slug: string;
  code: string;
  desc: string;
  units: string;
  categories: [Category];
}
export type Category = {
  name: string;
  slug: string;
  code: string;
  desc: string;
  category_h_pt2: string;
  category_h_pt3: string;
  cat_location_summary_pt2: string;
}
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
  bbox: [[number, number], [number, number]];
  boundary: GeographyFeature;
};

// export type GeographyAutoSuggestProps = {
//   bbox: number[];
//   cy: string;
//   en: string;
//   geoCode: string;
//   geoType: string;
//   sanitisedText?: string;
// };

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
  features: GeographyFeature[];
};

type GeographyFeature = {
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
