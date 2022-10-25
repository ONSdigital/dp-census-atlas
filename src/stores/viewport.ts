import { writable } from "svelte/store";
import type { Bbox, GeoType } from "../types";

/**
 * A Svelte store reflecting the current map viewpoort
 */
export const viewport = writable<{ bbox: Bbox; geoType: GeoType } | undefined>(undefined);
