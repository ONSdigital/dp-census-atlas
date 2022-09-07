import type { RequestHandler } from "@sveltejs/kit";

// return values from env set in runtime env (default to values set at build time if runtime env is missing var)
export const get: RequestHandler = async ({ params }) => {
  return {
    status: 200,
    body: {
      contentJsonUrls: JSON.parse(process.env["CONTENT_JSONS"] || import.meta.env.VITE_CONTENT_JSONS),
      geodataBaseUrl: process.env["GEODATA_BASE_URL"] || import.meta.env.VITE_GEODATA_BASE_URL,
    },
  };
};
