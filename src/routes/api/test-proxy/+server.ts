import type { RequestHandler } from "@sveltejs/kit";

// test for proxying requests to florence
export const GET: RequestHandler = async ({ fetch, url }) => {
  const fetchUrl = url.searchParams.get("url");
  if (!fetchUrl.startsWith("http")) {
    return new Response("Invalid url", { status: 400 });
  }
  const res = await fetch(fetchUrl);
  // NB returning responses that failed with a non-400 code seems to break the app, so we're masking a lot of stuff
  // as 404 here....
  if (res.status !== 200) {
    return new Response(`Could not fetch ${fetchUrl}`, { status: 404 });
  }
  return new Response(res.body, { status: res.status });
};