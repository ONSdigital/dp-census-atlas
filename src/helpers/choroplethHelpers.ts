import type { Mode, StringQuintuple } from "../types";
import { never } from "../util/typeUtil";

export const colours = {
  standard: ["#CDE594", "#80C6A3", "#1F9EB7", "#186290", "#080C54"] as StringQuintuple,
  neg: ["#ce321f", "#e16a4a", "#f09977", "#fac6a6", "#fef4d7"] as StringQuintuple,
  pos: ["#fef4d7", "#cad3c5", "#96b3b3", "#5f93a2", "#007590"] as StringQuintuple,
};

export const getColours = (mode: Mode, breaks: number[]): StringQuintuple => {
  switch (mode) {
    case "choropleth":
      return colours.standard;
    case "change":
      return getChangeColours(breaks);
    default:
      never(mode);
  }
};

export const getChangeColours = (breaks: number[]): StringQuintuple => {
  let result: string[];

  // simple cases, all positive or all negative
  if (breaks[0] >= 0) {
    result = colours.pos;
  } else if (breaks[breaks.length - 1] <= 0) {
    result = colours.neg;
  } else {
    // mixed cases
    const breaksNotIncludingMin = breaks.slice(1, breaks.length);
    const nBreaksBelowZero = breaksNotIncludingMin.filter((br) => br < 0).length;
    let nBreaksAboveZero = breaksNotIncludingMin.length - nBreaksBelowZero;

    // to ensure standardised length, pad with positives when needed
    const nBreaksWant = 5;
    const nBreaksGot = nBreaksBelowZero + 1 + nBreaksAboveZero;
    const nBreaksResidual = nBreaksWant - nBreaksGot;
    nBreaksAboveZero += nBreaksResidual;

    // remove the first and last color from neg and pos to make the neutral color
    const mixedNeutral = colours.pos[0];
    const mixedNeg = colours.neg.slice(0, -1);
    const mixedPos = colours.pos.slice(1);

    // NB avoid issue where slicing with zero index includes ALL neg or pos colors when there should be none.
    const negColours = nBreaksBelowZero > 0 ? mixedNeg.slice(nBreaksBelowZero * -1) : [];
    const posColours = nBreaksAboveZero > 0 ? mixedPos.slice(0, nBreaksAboveZero) : [];
    result = [...negColours, mixedNeutral, ...posColours];
  }

  return [result[0], result[1], result[2], result[3], result[4]];
};
