import { json, type RequestHandler } from "@sveltejs/kit";
// import data from "../../../data/geoLookup2021.json";
import topojson from "../../../map/topojson.json";
import { topoJsonLayersToAdd } from "../../../map/initMapLayers";

const data = (() => {
  const data = [];
  const codes = {};
  topoJsonLayersToAdd.forEach((l) => {
    topojson.objects[l].geometries.forEach((f) => {
      const obj = {
        en: f.properties.AREANM,
        geoType: l,
        geoCode: f.properties.AREACD,
      };
      if (!codes[obj.geoCode]) {
        data.push(obj);
        codes[obj.geoCode] = true;
      }
    });
  });
  data.sort((a, b) => a.en.localeCompare(b.en));
  return data;
})();

export const GET: RequestHandler = ({ url }) => {
  const q = url.searchParams.get("q").toLowerCase();

  if (q) {
    const results = data.filter((geo) => geo.en.toLowerCase().includes(q) || geo.geoCode.toLowerCase() === q);
    return json(results);
  } else {
    return json([]);
  }
};
