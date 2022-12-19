export const colours = {
  standard: ["#CDE594", "#80C6A3", "#1F9EB7", "#186290", "#080C54"],
  neg: ["#292567", "#50488E", "#7A6CB8", "#A495DC", "#BEB7D7"],
  pos: ["#FDCC88", "#FCA540", "#EA8223", "#D46012", "#BC3B00"],
  mid: "#DDDDDD",
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
  const nBreaksBelowZero = breaks.filter((br) => br < 0).length;
  const nBreaksAboveZero = breaks.length - nBreaksBelowZero;
  return [...colours.neg.slice(nBreaksBelowZero * -1), colours.mid, ...colours.pos.slice(0, nBreaksAboveZero)];
};
