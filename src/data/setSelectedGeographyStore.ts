import { selectedGeographyStore } from "../stores/stores";
import { fetchGeographyInfo } from "./api";

export const setSelectedGeographyStore = async (geoCode: string) => {
  const geographyInfo = await fetchGeographyInfo(geoCode).then((result) => JSON.parse(result));
  selectedGeographyStore.set({
    geoType: geographyInfo.meta.geotype.toLowerCase(),
    geoCode: geographyInfo.meta.code,
    displayName: geographyInfo.meta.name,
    bbox: geographyInfo.geo_json.features.find((f) => f.id === "bbox").geometry.coordinates as [
      number,
      number,
      number,
      number,
    ],
  });
  return Promise.resolve();
};
