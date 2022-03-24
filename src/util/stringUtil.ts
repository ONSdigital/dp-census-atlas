export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function unCapitalizeFirstLetter(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

export function assertPluralised(string) {
  return string.slice(-1) === "s" ? string : `${string}s`;
}
