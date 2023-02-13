import { json, type RequestHandler } from "@sveltejs/kit";
import data from "../../../data/geoLookup2021.json";

const onsLinkedDataAPI = "http://statistics.data.gov.uk/sparql.json?query=";

const sparQLprefix = `
PREFIX statent: <http://statistics.data.gov.uk/def/statistical-entity#>
PREFIX foi: <http://publishmydata.com/def/ontology/foi/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX collection: <http://statistics.data.gov.uk/def/geography/collection/>
PREFIX postcode: <http://statistics.data.gov.uk/id/postcode/unit/>
PREFIX within: <http://statistics.data.gov.uk/def/spatialrelations/within#>
PREFIX postcodeAlt: <http://statistics.data.gov.uk/def/postcode/unit#>
`;

const searchedForGeoTypes = {
  OA: ["E00", "W00"],
  MSOA: ["E02", "W02"],
  LAD: ["E06", "E07", "E08", "E09", "W06"],
};

const getGeoType = (geoCode: string): string => {
  for (const geoType in searchedForGeoTypes) {
    if (searchedForGeoTypes[geoType].includes(geoCode.slice(0, 3).toUpperCase())) {
      return geoType;
    }
  }
  return "NotRecognised";
};

const filterResults = (results) => {
  // aim here is to evenly populate a ten-long array of results...
  const output = [];
  const nFromEach = Math.round(10 / Object.keys(results).length);
  for (const rType in results) {
    output.push(...results[rType].slice(0, nFromEach));
  }
  return output;
};

export const GET: RequestHandler = async ({ url }) => {
  const q = url.searchParams.get("q").toLowerCase();
  const results = {};
  if (q) {
    // digits in string means either gss code or postcode search
    if (/\d/.test(q)) {
      // do GSS code search if q characters 1:3 match the searchedForgGeoTypes...
      const allGSSPrefixes = [...searchedForGeoTypes.OA, ...searchedForGeoTypes.MSOA, ...searchedForGeoTypes.LAD];
      if (allGSSPrefixes.includes(q.slice(0, 3).toUpperCase())) {
        const query = `
        SELECT DISTINCT ?en ?geoCode
        WHERE {
          VALUES ?typecd {${allGSSPrefixes.map((c) => `"${c}"`).join(" ")}}
          ?x rdfs:label ?geoCode ;
              statent:code ?type .
          ?type rdfs:label ?typecd .
          BIND (?geoCode as ?en)
          FILTER(STRSTARTS(LCASE(?en), LCASE("${q}")))
        }
        LIMIT 10
        `;
        const res = await fetch(`${onsLinkedDataAPI}${encodeURIComponent(sparQLprefix + query)}`);
        const rawResJson = await res.json();
        console.log(rawResJson);
        console.log(query);
        const resJson = rawResJson.results.bindings.map((r) => {
          return { en: r.en.value, geoType: getGeoType(r.geoCode.value), geoCode: r.geoCode.value };
        });
        results["GSS"] = resJson;
      }
    }

    return json(filterResults(results));
    // const msoaHCLresults = data.filter(
    //   (geo) => geo.geoType === "MSOA" && (geo.en.toLowerCase().includes(q) || geo.geoCode.toLowerCase() === q),
    // );
    //return json(msoaHCLresults);
  } else {
    return json([]);
  }
};
