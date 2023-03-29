// zoom level 0 has 50,000 households per dot
const densities = [50000, 20000, 10000, 5000, 2000, 1000, 500, 200, 100, 50, 20, 10, 5, 2, 1];

export function getDensityForZoomLevel(zoom: number) {
  return zoom < 12 ? densities[Math.floor(zoom)] : 10;
}

export const dotdensityColours = ["#3bb2d0", "#e55e5e", "#223b53", "#fbb03b", "#ccc"];
