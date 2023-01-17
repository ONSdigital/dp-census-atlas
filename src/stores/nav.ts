import { writable } from "svelte/store";

/**
 * A Svelte store for...
 */
export const nav = writable<Nav>({ open: false });

export type Nav = { open: boolean };
