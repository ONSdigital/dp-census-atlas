import { getContentForStore } from "../../helpers/contentHelpers";
import content from "../../data/content";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ fetch, request }) {
  const envName = process.env["ENV_NAME"] || import.meta.env.VITE_ENV_NAME;
  const isPublishing = (process.env["IS_PUBLISHING"] || "false").toLowerCase() === "true";
  const isDev = ["dev", "netlify"].includes(envName);

  // fetch content
  const fetchOpts = {
    cache: "no-cache", // always ask for latest content files
    headers: {
      cookie: request.headers.get("cookie") || undefined,
    },
  };
  const contentForStore = getContentForStore(content, isDev, isPublishing, fetch, fetchOpts);

  return {
    contentForStore: contentForStore,
  };
}
