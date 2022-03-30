import { parseSelectedGeographyData, parseGeographyInfo } from "./parsers";
import { getCodesForCategory } from "../helpers/categoryHelpers";
import { selectedGeographyStore } from "../stores/stores";
import type { GeoType } from "../types";
import { fetchGeographyInfo, fetchSelectedGeographyData } from "./api";

export const setSelectedGeographyStore = async (args: { geoType: GeoType; geoCode: string }) => {
  const peopleCodes = getCodesForCategory("health", "general-health", "default", "very-good-health");
  const householdsCodes = getCodesForCategory("housing", "size-of-household", "default", "1-person-households");

  const [geographyinfo, peopleTotal, householdTotal] = await Promise.all([
    fetchGeographyInfo(args.geoCode),
    fetchSelectedGeographyData({
      totalCode: peopleCodes.totalCode,
      categoryCodes: peopleCodes.categoryCodes,
      geoCode: args.geoCode,
    }),
    fetchSelectedGeographyData({
      totalCode: householdsCodes.totalCode,
      categoryCodes: householdsCodes.categoryCodes,
      geoCode: args.geoCode,
    }),
  ]);
  const parsedGeographyInfo = parseGeographyInfo(geographyinfo);
  selectedGeographyStore.set({
    geoType: parsedGeographyInfo.meta.geotype.toLowerCase(),
    geoCode: parsedGeographyInfo.meta.code,
    displayName: parsedGeographyInfo.meta.name,
    bbox: parsedGeographyInfo.geo_json.features.find((f) => f.id === "bbox").geometry.coordinates as [
      number,
      number,
      number,
      number,
    ],
    allHouseholdsTotal: parseSelectedGeographyData(householdTotal, householdsCodes.totalCode).selectedGeographyTotal,
    allPeopleTotal: parseSelectedGeographyData(peopleTotal, peopleCodes.totalCode).selectedGeographyTotal,
  });
  return Promise.resolve();
};
