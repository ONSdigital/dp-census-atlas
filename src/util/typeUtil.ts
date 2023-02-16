/* When used in the default case of a `switch` or `if` statement, ensures the case is unreachable. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function never(_: never): never {
  throw new Error("Unexpected value. Should have been never.");
}
