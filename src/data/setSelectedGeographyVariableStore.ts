import { parseSelectedGeographyData } from "./parsers";
import { selectedGeographyVariableStore } from "../stores/stores";
import { fetchSelectedGeographyData } from "./api";

export const setSelectedGeographyVariableStore = async (args: {
  totalCode: string;
  categoryCodes: string[];
  geoCode: string;
}) => {
  const variableData = await fetchSelectedGeographyData(args);
  const parsed = parseSelectedGeographyData(variableData, args.totalCode);
  selectedGeographyVariableStore.set({
    variableData: parsed.selectedGeoData,
    englandAndWalesVariableData: parsed.englandAndWalesGeoData,
  });
  return Promise.resolve();
};
