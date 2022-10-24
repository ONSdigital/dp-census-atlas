import { roundNumber, uniqueRoundedNumbers } from "../util/numberUtil"

const percentageDecimalPlaces = 1;

export function dataToRoundedString(r: number): string {
    return r.toFixed(percentageDecimalPlaces)
}

export function uniqueRoundedBreaks(breaks: number[]): number[] {
    return uniqueRoundedNumbers({numbers: breaks, decimalPlaces: percentageDecimalPlaces})
}

export function roundedData(r: number): number {
    return roundNumber({number: r, decimalPlaces: percentageDecimalPlaces})
}