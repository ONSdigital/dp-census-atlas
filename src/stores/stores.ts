import { writable } from "svelte/store";
import type { MapState, SelectedGeographyData, ContentTree, VizData, AppParams } from "../types";

/**
 * A Svelte store containing any map state we need to be aware of within the Svelte app.
 * */
export const mapStore = writable<MapState | undefined>(undefined);

/**
 * A Svelte store containing all the data we need in order to show a vizualisation.
 * */
export const vizStore = writable<VizData | undefined>(undefined);

/**
 * A Svelte store containing all the data we need to show the selected geography.
 */
export const selectedGeographyStore = writable<SelectedGeographyData | undefined>(undefined);

/**
 * A Svelte store ...
 */
export const preventFlyToGeographyStore = writable<string | undefined>(undefined);

/**
 * A Svelte store containing all loaded variableGroups and their metadata
 */
export const contentStore = writable<ContentTree | undefined>(undefined);

/**
 * A Svelte store containing the app params from the current URL
 */
export const appParamsStore = writable<AppParams | undefined>(undefined);

/**
 * A Svelte store indicating whether or not data is currently being updated
 */
 export const dataUpdateInProgressStore= writable<boolean>(false);
