import { ratioToPercentage, roundNumber, uniqueRoundedNumbers } from "../util/numberUtil"

const percentageDecimalPlaces = 1;
const ratioDecimalPlaces =  percentageDecimalPlaces * 3;

export function ratioToRoundedPercentageString(r: number): string {
    return ratioToPercentage(r, percentageDecimalPlaces)
}

export function uniqueRoundedBreaks(breaks: number[]): number[] {
    return uniqueRoundedNumbers({numbers: breaks, decimalPlaces: ratioDecimalPlaces})
}

export function roundedRatio(r: number): number {
    return roundNumber({number: r, decimalPlaces: ratioDecimalPlaces})
}