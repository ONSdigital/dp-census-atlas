# Stores

## vizStore

    {
       breaks: number[];
       places: { geoCode: string; count: number; percentage: number; total: number }[];
       params: {
          topic: typeof topics[0];
          variable: typeof topics[0]["variables"][0];
          category: typeof topics[0]["variables"][0]["categories"][0];
    }

## mapStore

    {
       bbox:{
          east: number;
          north: number;
          west: number;
          south: number;
          };
       geoType: "ew" | "lad" | "msoa" | string;
    }

## selectedGeographyStore

    {
       displayName: string,
       geoCode: string,
       geoType: string,
       allHouseholdsTotal:number,
       allPeopleTotal:number
    }

## selectedGeographyVariableStore

    {
       displayName: string,
       geoCode: string,
       geoType: string,
       variableData:{ [catCode: string]: { count: number; total: number; percentage: number } },
    }

## englandandWalesStore

    {
       [catCode: string]: { count: number; total: number; percentage: number },
    }
