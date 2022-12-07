export const choroplethColours = ["#CDE594", "#80C6A3", "#1F9EB7", "#186290", "#080C54"];
export const negativeColours = ["#e93e3a", "#ed683c", "#f3903f", "#fdc70c", "#fff33b"];

export const getColoursForBreaks = (breaks: number[]): string[] => {
  if (breaks[0] > 0) {
    return choroplethColours;
  }
  if (breaks[breaks.length - 1] <= 0) {
    return negativeColours;
  }
  const nBreaksZeroOrLess = breaks.filter((br) => br <= 0).length;
  const nBreaksAboveZero = breaks.length - nBreaksZeroOrLess;
  return [...negativeColours.slice(nBreaksZeroOrLess * -1), ...choroplethColours.slice(0, nBreaksAboveZero)];
};
