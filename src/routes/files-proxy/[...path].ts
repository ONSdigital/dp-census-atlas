import type { RequestHandler } from "@sveltejs/kit";
import { isPublishing, publishingDownloadUrl } from "../../env";

// proxy for using the publishing download service, which does not set CORS headers and so cannot be used directly
export const get: RequestHandler = async ({ request, params }) => {
  // 403 if we're not in publishing
  if (!isPublishing) {
    return {
      status: 403,
      body: "This endpoint is only available in publishing!",
    };
  }

  // get florence access token from cookies
  const cookies = request.headers.get("cookie") || "";
  const florence_cookies = cookies
    .split(";")
    .map((c) => c.trim())
    .filter((c) => c.startsWith("access_token="));

  // 401 if not logged in to florence
  if (florence_cookies.length === 0) {
    return {
      status: 401,
      body: "You must be logged in to florence to use this endpoint!",
    };
  }

  // get requested files from download-service
  const florence_cookie = florence_cookies[0].split("=")[1];
  const res = await fetch(`${publishingDownloadUrl}/${params.path}`, {
    headers: {
      "X-Florence-Token": florence_cookie,
    },
  });
  return res;
};
