import { capitalizeFirstLetter } from "./stringUtil";

const num =
  "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split(
    " ",
  );
const tens = "twenty thirty forty fifty sixty seventy eighty ninety".split(" ");

// https://stackoverflow.com/a/38658925
function number2words(n) {
  if (n < 20) return num[n];
  const digit = n % 10;
  if (n < 100) return tens[~~(n / 10) - 2] + (digit ? "-" + num[digit] : "");
  if (n < 1000) return num[~~(n / 100)] + " hundred" + (n % 100 == 0 ? "" : " " + number2words(n % 100));
  return number2words(~~(n / 1000)) + " thousand" + (n % 1000 != 0 ? " " + number2words(n % 1000) : "");
}

export function numberToWords(n: number) {
  return capitalizeFirstLetter(number2words(n));
}

export function ratioToPercentage(r: number, decimalPlaces?: number): string {
  if (typeof decimalPlaces !== undefined) {
    return (r * 100).toFixed(decimalPlaces);
  }
  return (r * 100).toFixed(0);
}

/*
  Return minimum decimal places needed to round ratios while ensuring they remain unique
*/
export function minDecimalPlacesToAntialias(ratios: number[]): number {
  let decimalPlaces = 0;
  let percentages = ratios.map((n) => ratioToPercentage(n, decimalPlaces));
  // iterate decimalPlaces until percentages contains only unique values
  while (new Set(percentages).size != ratios.length) {
    decimalPlaces += 1;
    percentages = ratios.map((n) => ratioToPercentage(n, decimalPlaces));
  }
  return decimalPlaces;
}
