import { json, type RequestHandler } from "@sveltejs/kit";
import data from "../../../data/geoLookup2021.json";
import type { GeoType } from "../../../types";

const onsLinkedDataAPI = "http://statistics.data.gov.uk/sparql.json?query=";

const sparQLprefix = `
PREFIX statent: <http://statistics.data.gov.uk/def/statistical-entity#>
PREFIX statdef: <http://statistics.data.gov.uk/def/statistical-geography#>
PREFIX foi: <http://publishmydata.com/def/ontology/foi/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX collection: <http://statistics.data.gov.uk/def/geography/collection/>
PREFIX postcode: <http://statistics.data.gov.uk/id/postcode/unit/>
PREFIX within: <http://publishmydata.com/def/ontology/foi/within>
`;

const searchedForGeoTypes = {
  OA: ["E00", "W00"],
  MSOA: ["E02", "W02"],
  LAD: ["E06", "E07", "E08", "E09", "W06"],
};
const allSearchedForGSSPrefixes = [...searchedForGeoTypes.OA, ...searchedForGeoTypes.MSOA, ...searchedForGeoTypes.LAD];

type SparQLResponseJson = {
  results: {
    bindings: {
      en: {
        value: string;
      };
      geoCode: {
        value: string;
      };
    }[];
  };
};
type ParsedResults = {
  en: string;
  geoType: GeoType;
  geoCode: string;
};
type QueryResults = {
  apiResponse: Response;
  parsedResults: ParsedResults[];
};

// q could be a GSS code search if upper-cased characters 1:3 match any of the searchedForGeoTypes
const isGSSCodeQ = (q: string): boolean => {
  return allSearchedForGSSPrefixes.includes(q.slice(0, 3).toUpperCase());
};

/* q could be a postcode code search if (when spaces are removed):
  - it is no longer than 7 chars
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
const isPostcodeQ = (q: string): boolean => {
  const qNoSpaces = q.replace(/\s/g, "");
  const nDigits = qNoSpaces.replace(/\D/g, "").length;
  const nLetters = qNoSpaces.length - nDigits;
  if (qNoSpaces.length > 7) {
    return false;
  } else if (qNoSpaces.length < 5) {
    return nDigits > 0 && nLetters > 0;
  } else {
    return nDigits > 0 && nLetters > 2;
  }
};

// q is assumed to be a named geography search if it isn't a GSS code or Postcode search
const isNamedGeoQ = (q: string): boolean => {
  return !isGSSCodeQ(q) && !isPostcodeQ(q);
};

const getGeoType = (geoCode: string): string => {
  for (const geoType in searchedForGeoTypes) {
    if (searchedForGeoTypes[geoType].includes(geoCode.slice(0, 3).toUpperCase())) {
      return geoType;
    }
  }
  return "NotRecognised";
};

const reformatAPIResults = (sparQLres: SparQLResponseJson): ParsedResults[] => {
  return sparQLres.results.bindings.map((r) => {
    return { en: r.en.value, geoType: getGeoType(r.geoCode.value) as GeoType, geoCode: r.geoCode.value };
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
    for (const r of results) {
      if (r.length > i && output.length < maxResults) {
        output.push(r[i]);
      }
    }
  }
  return output;
};

// search for LAD, MSOA, OA that match q as GSS code
const gssCodeSparQLQuery = async (q: string): Promise<QueryResults> => {
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
    return {
      apiResponse: res,
      parsedResults: reformatAPIResults(rawResJson),
    };
  } else {
    return {
      apiResponse: json([]),
      parsedResults: [],
    };
  }
};

// search for LAD, MSOA, OA that match q as postcode
const postcodeSparQLQuery = async (q: string): Promise<QueryResults> => {
  if (isPostcodeQ(q)) {
    const pcdQ = q.replace(/\s/g, "");
    const query = `
    SELECT DISTINCT ?en ?geoCode
      WHERE {
        VALUES ?typecd { ${allSearchedForGSSPrefixes.map((c) => `"${c}"`).join(" ")} }
        ?pcode foi:memberOf collection:postcodes ;
          within: ?allGeos ;
          foi:code ?en .
        ?allGeos rdfs:label ?geoCode ;
          statdef:status "live" .
        (?en ?score) <tag:stardog:api:property:textMatch> "${pcdQ}*" .
        FILTER(STRSTARTS(?geoCode, ?typecd))
    } ORDER BY ASC(?en) LIMIT 10`;
    const res = await fetch(`${onsLinkedDataAPI}${encodeURIComponent(sparQLprefix + query)}`);
    const rawResJson = await res.json();
    return {
      apiResponse: res,
      parsedResults: reformatAPIResults(rawResJson),
    };
  } else {
    return {
      apiResponse: json([]),
      parsedResults: [],
    };
  }
};

// search for LAD, MSOA, OA that match q as name
const namedGeoSparQLQuery = async (q: string): Promise<QueryResults> => {
  if (isNamedGeoQ(q)) {
    const query = `
    SELECT DISTINCT ?en ?geoCode
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
    return {
      apiResponse: res,
      parsedResults: reformatAPIResults(rawResJson),
    };
  } else {
    return {
      apiResponse: json([]),
      parsedResults: [],
    };
  }
};

export const GET: RequestHandler = async ({ url }) => {
  const q = url.searchParams.get("q").toLowerCase().trim();
  if (!q) {
    // return blank if no defined query
    return json([]);
  }
  // min q length is three
  if (q.length < 4) {
    return new Response("q must be four characters or more!", { status: 400 });
  }
  // do all appropriate sparql queries
  const allSparlQLRes = await Promise.all([gssCodeSparQLQuery(q), postcodeSparQLQuery(q), namedGeoSparQLQuery(q)]);
  // parse results
  const results = [];
  for (let i = 0; i < allSparlQLRes.length; i++) {
    const queryResult = allSparlQLRes[i];
    if (queryResult.apiResponse.status !== 200) {
      // error response on first error
      return queryResult.apiResponse;
    }
    // split results by geotype (NB correct postcode format if it matches a postcode) and append
    for (const g in searchedForGeoTypes) {
      results.push(
        queryResult.parsedResults
          .filter((r) => r.geoType === g)
          .map((r) => {
            if (isPostcodeQ(r.en)) {
              return { en: formatPcd(r.en), geoType: r.geoType, geoCode: r.geoCode };
            }
            return r;
          }),
      );
    }
  }
  // append MSOA HCL names from file if isNamedGeoQ
  if (isNamedGeoQ(q)) {
    results.push(
      data.filter(
        (geo) => geo.geoType === "MSOA" && (geo.en.toLowerCase().includes(q) || geo.geoCode.toLowerCase() === q),
      ),
    );
  }
  // evenly sample final results from all sets
  return json(evenlySampleResults(results));
};
