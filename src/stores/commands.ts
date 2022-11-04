import type { GeoType } from "../types";
import { writable } from "svelte/store";

/**
 * A Svelte store for issuing map commands...
 */
export const commands = writable<Command | undefined>(undefined);

// there's only one kind of command so far...
export type Command = { kind: "zoom"; geoType: GeoType };
