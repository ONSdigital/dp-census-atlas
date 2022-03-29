// import { fetchGeographyLookup } from "../data/fetchGeographyData";
import type { GeographyInfo, SelectedGeographyData } from "../types";
import { selectedGeographyStore } from "../stores/stores";

export default (location: string, store: SelectedGeographyData) => {
  // const code = location.split("=").pop();
  // const currentCode = store.geoCode;
  // if (code && code !== currentCode) {
  //   fetchGeographyLookup(code).then((response) => {
  //     if (response) {
  //       const {
  //         meta: { name, code, geotype },
  //         geo_json: { features },
  //       }: GeographyInfo = JSON.parse(response);
  //       const geoMeta = features.find((_) => _.id === "bbox");
  //       let bbox;
  //       if (geoMeta) {
  //         const {
  //           geometry: { coordinates },
  //         } = geoMeta;
  //         bbox = coordinates;
  //       }
  //       selectedGeographyStore.set({
  //         geoType: geotype.toLowerCase(),
  //         displayName: name,
  //         geoCode: code,
  //         bbox,
  //       });
  //     }
  //   });
  // }
};
