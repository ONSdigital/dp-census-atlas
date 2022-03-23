export const areAllDefined = (argAry: Array<Object | string | number>) => {
  return argAry.filter((arg) => arg === undefined).length === 0;
};

export const areAllUndefined = (argAry: Array<Object | string | number>) => {
  return argAry.filter((arg) => arg !== undefined).length === 0;
};
