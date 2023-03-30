import { writable } from "svelte/store";
import type { Bbox, GeoType } from "../types";

export type Viewport = { zoom: number; bbox: Bbox; geoType: GeoType; idealGeoType: GeoType } | undefined;

/**
 * A Svelte store reflecting the current map viewpoort
 */
export const viewport = writable<Viewport>(undefined);
