export type DataEnv = "dev" | "web" | "publishing";

export const GeoTypes = ["ew", "lad", "msoa", "oa"] as const;
export type GeoType = (typeof GeoTypes)[number];

export type VariableGroup = {
  name: string;
  slug: string;
  desc: string;
  variables: Variable[];
};

export type Variable = {
  name: string;
  slug: string;
  code: string;
  desc: string;
  long_desc: string;
  units: string;
  topic_code: string;
  caveat_text: string;
  caveat_link: string;
  base_url_2021: string;
  base_url_2021_dev_override: string;
  base_url_2011_2021_comparison: string;
  base_url_2011_2021_comparison_dev_override: string;
  classifications: Classification[];
};

export type Classification = {
  code: string;
  slug: string;
  desc: string;
  dataset: string;
  data_download: string;
  available_geotypes: GeoType[];
  choropleth_default: boolean;
  dot_density_default: boolean;
  comparison_2011_data_available_geotypes: GeoType[];
  change_notes: string;
  change_notes_link: string;
  categories: Category[];
};

export type Category = {
  name: string;
  slug: string;
  code: string;
  legend_str_1: string;
  legend_str_2: string;
  legend_str_3: string;
  restrict_to_modes: Mode[];
};
export type VariableData = { [catCode: string]: { count: number; total: number; percentage: number } };

export type NumberQuadruple = [number, number, number, number];
export type StringQuintuple = [string, string, string, string, string];

export type VizData = {
  geoType: GeoType;
  breaks: number[];
  places: { geoCode: string; categoryValue: number }[];
  params: {
    mode: Mode;
    variableGroup: VariableGroup;
    variable: Variable;
    category: Category;
  };
};

export type GeographyInfo = {
  geoType: GeoType;
  geoCode: string;
  displayName: string;
  bbox: [[number, number], [number, number]];
  boundary: GeographyFeature;
};

export type GeographySearchItem = {
  kind: "Geography";
  geoType: GeoType;
  geoCode: string;
  en: string;
  cy: string;
  bbox: number[];
};
export type PostcodeSearchItem = {
  kind: "Postcode";
  value: string;
  oa: string;
};
export type AreaSearchItem = GeographySearchItem | PostcodeSearchItem;

export type GeographyData = {
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
    coordinates: [[number, number], [number, number]];
  };
  properties?: unknown;
};

export type Bbox = {
  east: number;
  north: number;
  west: number;
  south: number;
};

export type LoadedGeographies = {
  categoryCode: string;
  geoCodes: {
    lad: Set<string>;
    msoa: Set<string>;
    oa: Set<string>;
  };
};

export type LocaleSuggestions = [
  {
    label: string;
    variableGroup: string;
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

export type ContentConfig = {
  devContentJsonUrl: string;
  webContentJsonUrl: string;
  publishingContentJsonUrl: string;
};

export const modes = ["choropleth", "change"] as const;
export type Mode = (typeof modes)[number];

export type ContentTree = {
  [Key in Mode]: {
    releases: string[];
    variableGroups: VariableGroup[];
    fakeDataLoaded: boolean;
  };
};
