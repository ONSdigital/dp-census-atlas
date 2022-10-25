// ToDo remove this deprecated module once fake data is in percentages!
import { ratioToPercentage, roundNumber, uniqueRoundedNumbers } from "../util/numberUtil"

const percentageDecimalPlaces = 1;
const ratioDecimalPlaces =  percentageDecimalPlaces * 3;

export function dataToRoundedString(r: number): string {
    return ratioToPercentage(r, percentageDecimalPlaces)
}

export function uniqueRoundedBreaks(breaks: number[]): number[] {
    return uniqueRoundedNumbers({numbers: breaks, decimalPlaces: ratioDecimalPlaces})
}

export function roundedData(r: number): number {
    return roundNumber({number: r, decimalPlaces: ratioDecimalPlaces})
}