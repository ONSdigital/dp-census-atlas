export const choroplethColours = ["#CDE594", "#80C6A3", "#1F9EB7", "#186290", "#080C54"];

function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(rgb) {
  return "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
}

export const getHeatMapColours = (breaks) => {
  const red = [255, 0, 0];
  const yellow = [255, 255, 0];
  const spectrum = [rgbToHex(red)];
  for (let i = 1; i < breaks.length - 1; i++) {
    spectrum.push(
      rgbToHex([
        red[0] + Math.round(((yellow[0] - red[0]) / (breaks.length - 1)) * i),
        red[1] + Math.round(((yellow[1] - red[1]) / (breaks.length - 1)) * i),
        red[2] + Math.round(((yellow[2] - red[2]) / (breaks.length - 1)) * i),
      ]),
    );
  }
  spectrum.push(rgbToHex(yellow));
  return spectrum;
};
