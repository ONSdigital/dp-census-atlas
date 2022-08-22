import type { RequestHandler } from "@sveltejs/kit";
import data from "../data/geoLookup.json";

export const get: RequestHandler = ({ url }) => {
  const q = url.searchParams.get("q").toLowerCase();

  if (q) {
    const results = data.filter(
      (geo) => geo.en.toLowerCase().includes(q) || geo.cy.toLowerCase().includes(q) || geo.geoCode.toLowerCase() === q,
    );
    return { ...ok, body: results };
  } else {
    return ok;
  }
};

const ok = {
  status: 200,
};
