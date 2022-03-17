import type topics from "./data/content"

export type GeoType = 'lad' | 'msoa'

export type MapState = {
  bbox: Bbox;
  geoType: GeoType;
};

export type VizData = {
  breaks: number[];
  places: { geoCode: string; count: number; percentage: number; total: number }[];
  params: {
    topic: typeof topics[0];
    variable: typeof topics[0]["variables"][0];
    category: typeof topics[0]["variables"][0]["categories"][0];
  };
};

export type Bbox = {
  east: number;
  north: number;
  west: number;
  south: number;
};
