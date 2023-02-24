import { json, type RequestHandler } from "@sveltejs/kit";
import data from "../../../data/geoLookup2021.json";

const onsLinkedDataAPI = "http://statistics.data.gov.uk/sparql.json?query=";

const sparQLprefix = `
PREFIX statent: <http://statistics.data.gov.uk/def/statistical-entity#>
PREFIX statdef: <http://statistics.data.gov.uk/def/statistical-geography#>
PREFIX foi: <http://publishmydata.com/def/ontology/foi/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX collection: <http://statistics.data.gov.uk/def/geography/collection/>
PREFIX postcode: <http://statistics.data.gov.uk/id/postcode/unit/>
PREFIX within: <http://statistics.data.gov.uk/def/spatialrelations/within#>
PREFIX bestFit: <http://statistics.data.gov.uk/def/hierarchy/best-fit#>
`;

const searchedForGeoTypes = {
  OA: ["E00", "W00"],
  MSOA: ["E02", "W02"],
  LAD: ["E06", "E07", "E08", "E09", "W06"],
};
const allSearchedForGSSPrefixes = [...searchedForGeoTypes.OA, ...searchedForGeoTypes.MSOA, ...searchedForGeoTypes.LAD];

// q could be a GSS code search if upper-cased characters 1:3 match any of the searchedForGeoTypes
const isGSSCodeQ = (q: string) => {
  return allSearchedForGSSPrefixes.includes(q.slice(0, 3).toUpperCase());
};

/* q could be a postcode code search if (when spaces are removed):
  - it contains at least one digit and one letter if less than 5 chars
  - it contains at least one digit and two letters if 5 chars or more

Based on:

    Validation

    The format is as follows, where A signifies a letter and 9 a digit:

    Format   | Coverage                                   | Example
    ----------------------------------------------------------------
    AA9A 9AA | WC postcode area; EC1–EC4, NW1W, SE1P, SW1 | EC1A 1BB
    ----------------------------------------------------------------
    A9A 9AA  | E1, N1, W1                                 | W1A 0AX
    ----------------------------------------------------------------
    A9 9AA   | B, E, G, L, M, N, S, W                     | M1 1AE
    A99 9AA  |                                            | B33 8TH
    ----------------------------------------------------------------
    AA9 9AA  | All other postcodes                        | CR2 6XH
    AA99 9AA |                                            | DN55 1PT
    ----------------------------------------------------------------

  From: https://en.wikipedia.org/wiki/Postcodes_in_the_United_Kingdom
*/
const isPostcodeQ = (q: string) => {
  const qNoSpaces = q.replace(/\s/g, "");
  const nDigits = qNoSpaces.replace(/\D/g, "").length;
  const nLetters = qNoSpaces.length - nDigits;
  if (qNoSpaces.length < 5) {
    return nDigits > 0 && nLetters > 0;
  } else {
    return nDigits > 0 && nLetters > 2;
  }
  return false;
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

const formatPcd = (pcd: string): string => {
  // return as is if already has spaces
  if (/\s/g.test(pcd)) {
    return pcd;
  }
  // otherwise return with space inserted before inward code (final triplet)
  return pcd.slice(0, -3) + " " + pcd.slice(-3);
};

const evenlySampleResults = (results) => {
  // aim here is to populate a ten-long array of results with ~equal samples from each subset of results...
  const output = [];
  const maxResults = 10;
  for (let i = 0; i < maxResults; i++) {
    for (const rType in results) {
      if (results[rType].length > i && output.length < maxResults) {
        output.push(results[rType][i]);
      }
    }
  }
  return output;
};

const gssCodeOrPostcodeQuery = async (q: string): Promise<Response> => {
  const results = {};
  // do GSS code search if q could be a partial or complete GSS code
  if (isGSSCodeQ(q)) {
    const qAsGeoType = q.slice(0, 3).toUpperCase();
    const query = `
    SELECT DISTINCT ?en ?geoCode
    WHERE {
      ?x rdfs:label ?geoCode ;
          statdef:status "live" ;
          statent:code ?type .
      ?type rdfs:label "${qAsGeoType}" .
      BIND (?geoCode as ?en)
      (?en ?score) <tag:stardog:api:property:textMatch> "${q}*"  .
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
  // and/or do postcode search if q could be a partial or complete postcode
  if (isPostcodeQ(q)) {
    //Remove internal spaces from query first
    const pcdQ = q.replace(/\s/g, "");
    const query = `
    SELECT DISTINCT ?en ?geoCodeOA ?geoCodeMSOA ?geoCodeLAD
      WHERE {
        ?pcode foi:memberOf collection:postcodes ;
          within:outputarea ?oaRaw ;
          within:superoutputareamiddlelayer ?msoaRaw ;
          bestFit:localauthoritydistrict ?ladRaw ;
          foi:code ?en .
        ?oaRaw rdfs:label ?geoCodeOA ;
          statdef:status "live" .
        ?msoaRaw rdfs:label ?geoCodeMSOA ;
          statdef:status "live" .
        ?ladRaw rdfs:label ?geoCodeLAD ;
          statdef:status "live" .
        (?en ?score) <tag:stardog:api:property:textMatch> "${pcdQ}*"  .
    } ORDER BY ASC(?en) LIMIT 10`;
    const res = await fetch(`${onsLinkedDataAPI}${encodeURIComponent(sparQLprefix + query)}`);
    const rawResJson = await res.json();
    if (res.status !== 200) {
      return new Response(rawResJson.errors, { status: res.status });
    } else {
      // get results and re-insert space for display
      results["pcdOA"] = rawResJson.results.bindings.map((r) => {
        return { en: formatPcd(r.en.value), geoType: "OA", geoCode: r.geoCodeOA.value };
      });
      results["pcdMSOA"] = rawResJson.results.bindings.map((r) => {
        return { en: formatPcd(r.en.value), geoType: "MSOA", geoCode: r.geoCodeMSOA.value };
      });
      results["pcdLAD"] = rawResJson.results.bindings.map((r) => {
        return { en: formatPcd(r.en.value), geoType: "LAD", geoCode: r.geoCodeLAD.value };
      });
    }
  }
  return json(evenlySampleResults(results));
};

const namedGeoSearch = async (q: string): Promise<Response> => {
  const results = {};
  // search combination of LAD,MSOA,OA from sparQL + HCL MSOA from json
  results["msoaHCL"] = data.filter(
    (geo) => geo.geoType === "MSOA" && (geo.en.toLowerCase().includes(q) || geo.geoCode.toLowerCase() === q),
  );
  const query = `
  SELECT ?en ?geoCode
  WHERE {
    {
      # Select max 10 matching LADs
      SELECT ?en ?geoCode
      WHERE {
        VALUES ?typecd {${searchedForGeoTypes.LAD.map((c) => `"${c}"`).join(" ")}}
        ?x foi:displayName ?en ;
            rdfs:label ?geoCode ;
            statent:code ?type .
        ?type rdfs:label ?typecd .
        (?en ?score) <tag:stardog:api:property:textMatch> "/.*${q}.*/" 
      }
      LIMIT 10
    } UNION {
      # Select max 10 matching MSOAs
      SELECT ?en ?geoCode
      WHERE {
        VALUES ?typecd {${searchedForGeoTypes.MSOA.map((c) => `"${c}"`).join(" ")}}
        ?x foi:displayName ?en ;
            rdfs:label ?geoCode ;
            statent:code ?type .
        ?type rdfs:label ?typecd .
        (?en ?score) <tag:stardog:api:property:textMatch> "/.*${q}.*/" .
      }
      LIMIT 10
    } UNION {
      # Select max 10 matching OAs
      SELECT ?en ?geoCode
      WHERE {
        VALUES ?typecd {${searchedForGeoTypes.OA.map((c) => `"${c}"`).join(" ")}}
        ?x foi:displayName ?en ;
            rdfs:label ?geoCode ;
            statent:code ?type .
        ?type rdfs:label ?typecd .
        (?en ?score) <tag:stardog:api:property:textMatch> "/.*${q}.*/" .
      }
      LIMIT 10
    }
  }`;
  const res = await fetch(`${onsLinkedDataAPI}${encodeURIComponent(sparQLprefix + query)}`);
  const rawResJson = await res.json();
  if (res.status !== 200) {
    return new Response(rawResJson.errors, { status: res.status });
  } else {
    const allSparQLRes = reformatAPIResults(rawResJson);
    results["namedLAD"] = allSparQLRes.filter((r) => r.geoType === "LAD");
    results["namedMSOA"] = allSparQLRes.filter((r) => r.geoType === "MSOA");
    results["namedOA"] = allSparQLRes.filter((r) => r.geoType === "OA");
  }
  return json(evenlySampleResults(results));
};

export const GET: RequestHandler = async ({ url }) => {
  const q = url.searchParams.get("q").toLowerCase().trim();
  if (q) {
    // min q length is three
    if (q.length < 3) {
      return new Response("q must be three characters or more!", { status: 400 });
    }
    if (/\d/.test(q)) {
      // digits in string means either gss code or postcode search
      return await gssCodeOrPostcodeQuery(q);
    } else {
      // no digits in string means named geography search
      return await namedGeoSearch(q);
    }
  } else {
    return json([]);
  }
};
