import { writable } from "svelte/store";
import type { GeoType } from "../types";

/**
 * A Svelte store reflecting the currently-hovered geography
 */
export const hovered = writable<{ geoType: GeoType; geoCode: string; displayName: string } | undefined>(undefined);
