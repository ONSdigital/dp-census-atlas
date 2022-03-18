import { writable } from "svelte/store";
import type { MapState, VizData } from "../types";

/**
 * A Svelte store containing any relevant map state
 * we need to be aware of within the Svelte app.
 * */
export const mapStore = writable<MapState | undefined>(undefined);

/**
 * A Svelte store containing all the data we need in
 * order to show a vizualisation (i.e., a query response).
 * */
export const vizStore = writable<VizData | undefined>(undefined);
