import type { ContentTree } from "src/types";
import { writable } from "svelte/store";

export const content = writable<ContentTree | undefined>(undefined);
