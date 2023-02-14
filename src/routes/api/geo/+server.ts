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

const reformatAPIResults = (resultsJson) => {
  return resultsJson.results.bindings.map((r) => {
    return { en: r.en.value, geoType: getGeoType(r.geoCode.value), geoCode: r.geoCode.value };
  });
};

const filterResults = (results) => {
  // aim here is to evenly populate a ten-long array of results...
  const output = [];
  const maxResults = 10;
  for (let i = 0; i < maxResults; i++) {
    for (const rType in results) {
      if (results[rType].length > i) {
        output.push(results[rType][i]);
      }
    }
  }
  return output;
};

export const GET: RequestHandler = async ({ url }) => {
  const q = url.searchParams.get("q").toLowerCase();
  const results = {};
  if (q) {
    // min q length is three
    if (q.length < 3) {
      return new Response("q must be three characters or more!", { status: 400 });
    }
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
        LIMIT 10`;
        const res = await fetch(`${onsLinkedDataAPI}${encodeURIComponent(sparQLprefix + query)}`);
        const rawResJson = await res.json();
        if (res.status !== 200) {
          return new Response(rawResJson.errors, { status: res.status });
        } else {
          results["gss"] = reformatAPIResults(rawResJson);
        }
      }
      // always do postcode search
      const spacesInQ = /\s+/g.test(q);
      const postcodeNoSpacesStatement = spacesInQ ? "." : "foi:code ?postcodeNoSpaces .";
      const filterTargetStatement = spacesInQ ? "?en" : "?postcodeNoSpaces";
      const query = `
      SELECT DISTINCT ?en ?geoCode
      WHERE {
        ?pcode foi:memberOf collection:postcodes ;
              within:outputarea ?oaRaw ;
              postcodeAlt:postcode1space ?en ;
            ${postcodeNoSpacesStatement}
        ?oaRaw rdfs:label ?geoCode .
        FILTER(STRSTARTS(LCASE(${filterTargetStatement}), LCASE("${q}")))
      }
      LIMIT 10`;
      const res = await fetch(`${onsLinkedDataAPI}${encodeURIComponent(sparQLprefix + query)}`);
      const rawResJson = await res.json();
      if (res.status !== 200) {
        return new Response(rawResJson.errors, { status: res.status });
      } else {
        results["pcd"] = reformatAPIResults(rawResJson);
      }
      return json(filterResults(results));
    }
    // search combination of known LAD / MSOA + Non-HCL MSOA
    results["msoaHCL"] = data.filter((geo) => geo.en.toLowerCase().includes(q) || geo.geoCode.toLowerCase() === q);
    const query = `
    SELECT ?en ?geoCode
    WHERE {
      VALUES ?typecd {${searchedForGeoTypes.MSOA.map((c) => `"${c}"`).join(" ")}}
      ?x foi:displayName ?en ;
          rdfs:label ?geoCode ;
          statent:code ?type .
      ?type rdfs:label ?typecd .
      FILTER(CONTAINS(LCASE(?en),  LCASE("${q}")))
    }
    LIMIT 10`;
    const res = await fetch(`${onsLinkedDataAPI}${encodeURIComponent(sparQLprefix + query)}`);
    const rawResJson = await res.json();
    if (res.status !== 200) {
      return new Response(rawResJson.errors, { status: res.status });
    } else {
      results["msoaNonHCL"] = reformatAPIResults(rawResJson);
    }
    return json(filterResults(results));
  } else {
    return json([]);
  }
};
