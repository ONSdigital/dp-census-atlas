import { writable } from "svelte/store";

export type TipStoreState = typeof defaultValue;

const defaultValue = {
  seenZoomTip: false,
};

const { subscribe, set, update } = writable(defaultValue);

const reset = () => {
  set(defaultValue);
};

const seenZoomTip = () =>
  update((state) => {
    return { ...state, seenZoomTip: true };
  });

export default {
  reset,
  subscribe,
  seenZoomTip,
};
