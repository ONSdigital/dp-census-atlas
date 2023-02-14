import type { Mode, StringQuintuple } from "../types";
import { never } from "../util/typeUtil";

export const colours = {
  standard: ["#CDE594", "#80C6A3", "#1F9EB7", "#186290", "#080C54"] as StringQuintuple,
  neg: ["#007590", "#538d9e", "#81a6ac", "#abbfbb", "#d5d9c9"] as StringQuintuple,
  pos: ["#fbd0af", "#f5ab89", "#eb8665", "#de6041", "#ce321f"] as StringQuintuple,
  neutral: "#fef4d7",
  noData: "#808B96",
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

export const getChangeColours = (breaks: number[]): [string, string, string, string, string] => {
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

    // NB avoid issue where slicing with zero index includes ALL neg or pos colors when there should be none
    const negColours = nBreaksBelowZero > 0 ? colours.neg.slice(nBreaksBelowZero * -1) : [];
    const posColours = nBreaksAboveZero > 0 ? colours.pos.slice(0, nBreaksAboveZero) : [];
    result = [...negColours, colours.neutral, ...posColours];
  }

  return [result[0], result[1], result[2], result[3], result[4]];
};
