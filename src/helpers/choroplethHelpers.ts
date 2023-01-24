export const colours = {
  standard: ["#CDE594", "#80C6A3", "#1F9EB7", "#186290", "#080C54"],
  neg: ["#292567", "#50488E", "#7A6CB8", "#A495DC", "#BEB7D7"],
  pos: ["#FDCC88", "#FCA540", "#EA8223", "#D46012", "#BC3B00"],
  mid: "#AED6F1",
};

export const getColoursForBreaks = (breaks: number[], changeOverTime: boolean): string[] => {
  if (!changeOverTime) {
    return colours.standard;
  }
  if (breaks[0] > 0) {
    return colours.pos;
  }
  if (breaks[breaks.length - 1] <= 0) {
    return colours.neg;
  }
  const breaksNotIncludingMin = breaks.slice(1, breaks.length);
  const nBreaksBelowZero = breaksNotIncludingMin.filter((br) => br < 0).length;
  const nBreaksAboveZero = breaksNotIncludingMin.length - nBreaksBelowZero;

  // NB avoid issue where slicing with zero index includes ALL neg or pos colors when there should be none
  const negColours = nBreaksBelowZero > 0 ? colours.neg.slice(nBreaksBelowZero * -1) : [];
  const posColours = nBreaksAboveZero > 0 ? colours.pos.slice(0, nBreaksAboveZero) : [];

  return [...negColours, colours.mid, ...posColours];
};
