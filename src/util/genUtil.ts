export const areAllDefined = (argAry: Array<Object|String|number>) => {
    return argAry.filter((arg) => arg === undefined).length === 0
}
