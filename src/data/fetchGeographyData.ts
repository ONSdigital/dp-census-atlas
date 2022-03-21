

const apiBaseUrl = `https://cep5lmkia0.execute-api.eu-west-1.amazonaws.com/dev`;

export const fetchGeographyData = async (args: {
    totalCode: string;
    categoryCodes: string[];
    geoCode: string;
})

const fetchSelectedGeographyData = async (args: {totalCode: string; categoryCodes: string[]; geoCode: string}) => {
    const url = `${apiBaseUrl}/query/2011?cols=${args.totalCode},${args.categoryCodes.join(",")}&rows=${args.geoCode}`
    const response = await fetch(url)
    const csv = await response.text()
    return dsv.csvParse(csv)
  }


const parseSelectedGeographyData = (rawData: dsv.DSVRowArray<string>, totalCode: string) => {
    const total = parseInt(rawData[0][totalCode]);
    const catCodesArr = rawData.columns.filter((catCode) => catCode != totalCode);
    const selectedLocationData = {}
    catCodesArr.forEach((categoryCode) => {
      const count = parseInt(rawData[0][categoryCode]);
      const percentage = (count / total) * 100;
      selectedLocationData[categoryCode] = { count: count, total: total, percentage: percentage };
    });
    return selectedLocationData
  };