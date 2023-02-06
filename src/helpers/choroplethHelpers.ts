export const choroplethColours = {
  standard: ["#CDE594", "#80C6A3", "#1F9EB7", "#186290", "#080C54"],
  neg: ["#007590", "#538d9e", "#81a6ac", "#abbfbb", "#d5d9c9"],
  pos: ["#fbd0af", "#f5ab89", "#eb8665", "#de6041", "#ce321f"],
  neutral: "#fef4d7",
  noData: "#808B96",
};

export const getChangeOverTimeColours = (breaks: number[]): [string, string, string, string, string] => {
  // simple cases, all positive or all negative
  let colours;
  if (breaks[0] >= 0) {
    colours = choroplethColours.pos;
  } else if (breaks[breaks.length - 1] <= 0) {
    colours = choroplethColours.neg;
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
    const negColours = nBreaksBelowZero > 0 ? choroplethColours.neg.slice(nBreaksBelowZero * -1) : [];
    const posColours = nBreaksAboveZero > 0 ? choroplethColours.pos.slice(0, nBreaksAboveZero) : [];
    colours = [...negColours, choroplethColours.neutral, ...posColours];
  }
  return [colours[0], colours[1], colours[2], colours[3], colours[4]];
};
