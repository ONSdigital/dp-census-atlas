import { writable } from "svelte/store";

/**
 * A Svelte store for the state of the nav (open or closed).
 */
export const nav = writable<Nav>({ open: false });

export type Nav = { open: boolean };
