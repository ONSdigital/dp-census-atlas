// zoom level 0 has 50,000 households per dot
const densities = [50000, 20000, 10000, 5000, 2000, 1000, 500, 200, 100, 50, 20, 10, 5, 2, 1];

export function getDensityForZoomLevel(zoom: number) {
  return zoom < 14 ? densities[Math.floor(zoom)] : 1;
}

export function makeUnitSingular(str: string, zoom: number) {
  const singular = getDensityForZoomLevel(zoom) === 1;
  return singular ? str.replace("households", "household").replace("people", "person") : str;
}

export const dotdensityColours = ["#27A0CC", "#F66068", "#003C57", "#FBB03B", "#ccc"];
