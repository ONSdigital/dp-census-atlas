import { writable } from "svelte/store";

// todo: this one is work-in-progress...
export const preventFlyToGeographyStore = writable<string | undefined>(undefined);
