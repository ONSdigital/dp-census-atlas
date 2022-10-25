import { writable } from "svelte/store";
import type { MapViewport } from "../types";

/**
 * A Svelte store reflecting the current map viewpoort
 */
export const viewport = writable<MapViewport | undefined>(undefined);
