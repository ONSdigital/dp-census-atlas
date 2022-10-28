import { roundNumber, uniqueRoundedNumbers } from "../util/numberUtil"

const percentageDecimalPlaces = 1;

export function percentageToRoundedString(r: number): string {
    return r.toFixed(percentageDecimalPlaces)
}

export function nonPercentageToRoundedString(r: number): string {
    return parseInt(r.toFixed()).toLocaleString()
}

export function uniqueRoundedPercentageBreaks(breaks: number[]): number[] {
    return uniqueRoundedNumbers({numbers: breaks, decimalPlaces: percentageDecimalPlaces})
}

export function uniqueRoundedNonPercentageBreaks(breaks: number[]): number[] {
    return uniqueRoundedNumbers({numbers: breaks, decimalPlaces: 0})
}

export function roundedPercentageData(r: number): number {
    return roundNumber({number: r, decimalPlaces: percentageDecimalPlaces})
}

export function roundedNonPercentageData(r: number): number {
    return roundNumber({number: r, decimalPlaces: 0})
}