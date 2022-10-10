import { englandAndWalesBbox } from "../helpers/geographyHelper";
import { selectedGeographyStore, dataUpdateInProgressStore } from "../stores/stores";
import { fetchGeographyInfo } from "./api";

export const setSelectedGeographyStore = async (geoCode: string) => {
  dataUpdateInProgressStore.set(true)
  const geographyInfo = await fetchGeographyInfo(geoCode).then((result) => JSON.parse(result));

  const geoType = geographyInfo.meta.geotype.toLowerCase();
  const displayName = geographyInfo.meta.name;
  const geographies =
    geoType === "ew"
      ? {
          bbox: englandAndWalesBbox,
          boundary: undefined, // not used
        }
      : {
          bbox: geographyInfo.geo_json.features.find((f) => f.id === "bbox")?.geometry?.coordinates,
          boundary: geographyInfo.geo_json.features.find((f) => f.id === "boundary"),
        };
  selectedGeographyStore.set({
    geoType,
    geoCode,
    displayName,
    ...geographies,
  });
  dataUpdateInProgressStore.set(false)
  return Promise.resolve();
};
