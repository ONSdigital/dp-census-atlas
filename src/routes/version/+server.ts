import { json, type RequestHandler } from "@sveltejs/kit";

// seasily see the deployed version if you manually change it
export const GET: RequestHandler = () => {
  return json({ version: "1.39.0" });
};
