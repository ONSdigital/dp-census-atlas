import type { ContentTree } from "../types";
import { writable } from "svelte/store";

export const content = writable<ContentTree | undefined>(undefined);
