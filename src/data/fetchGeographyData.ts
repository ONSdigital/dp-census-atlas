import { defaultGeography } from "../helpers/spatialHelper";

const apiBaseUrl = `https://cep5lmkia0.execute-api.eu-west-1.amazonaws.com/dev`;

export const fetchGeographyLookup = async (location: string, useCode = true) => {
  // return defaultGeography if the name or code matches...
  if ((useCode && defaultGeography.meta.code == location) || defaultGeography.meta.name == location) {
    return JSON.stringify(defaultGeography);
  }
  // otherwise query API
  const url = `${apiBaseUrl}/geo/2011?${useCode ? "geocode" : "geoname"}=${location}`;
  const response = await fetch(url);
  const data = await response.text();
  return data;
};
