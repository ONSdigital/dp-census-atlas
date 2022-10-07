import { uniqueRoundedNumbers } from "./numberUtil";

describe("uniqueRoundedNumbers", () => {
  test("returns rounded original numbers if they differ by more than supplied decimal places", () => {
    [
      { testArgs: { numbers: [1, 2, 3, 4, 5], decimalPlaces: 1 }, expected: [1, 2, 3, 4, 5] },
      { testArgs: { numbers: [1.1, 2.2, 3.3, 4.4, 5.5], decimalPlaces: 1 }, expected: [1.1, 2.2, 3.3, 4.4, 5.5] },
      {
        testArgs: { numbers: [1.101, 2.202, 3.303, 4.404, 5.505], decimalPlaces: 1 },
        expected: [1.1, 2.2, 3.3, 4.4, 5.5],
      },
      { testArgs: { numbers: [1], decimalPlaces: 1 }, expected: [1] },
    ].forEach((testVals) => {
      expect(uniqueRoundedNumbers(testVals.testArgs)).toEqual(testVals.expected);
    });
  });
  test("returns unique rounded original numbers only if they differ by less than supplied decimal places", () => {
    [
      { testArgs: { numbers: [1, 1, 1, 4, 5], decimalPlaces: 1 }, expected: [1, 4, 5] },
      { testArgs: { numbers: [2.2, 2.2, 3.3, 4.4, 5.5], decimalPlaces: 1 }, expected: [2.2, 3.3, 4.4, 5.5] },
      { testArgs: { numbers: [1.101, 2.202, 3.303, 4.404, 4.404], decimalPlaces: 1 }, expected: [1.1, 2.2, 3.3, 4.4] },
    ].forEach((testVals) => {
      expect(uniqueRoundedNumbers(testVals.testArgs)).toEqual(testVals.expected);
    });
  });
});
