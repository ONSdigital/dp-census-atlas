export const calculateDataBreakBuckets = (breaks: number[], min: number) => {
  const fullBreaks = [min, ...breaks];
  const stringsArr = [];
  for (let i = 0; i < 5; i++) {
    const lowVal = (Math.round(fullBreaks[i] * 10) / 10).toFixed(1);
    let upperVal;
    if (i === 4) {
      //for highest bucket, set upperVal to the highest data value
      upperVal = (Math.round(fullBreaks[i + 1] * 10) / 10).toFixed(1);
    } else {
      //for all other buckets, set upperVal to the start of the next bucket minus 0.1
      upperVal = (Math.round(fullBreaks[i + 1] * 10) / 10 - 0.1).toFixed(1);
    }
    stringsArr.push(`${lowVal}% - ${upperVal}%`);
  }
  return stringsArr.reverse();
};
