import { json, type RequestHandler } from "@sveltejs/kit";

// simple healthcheck endpoint for use by ONS CI as heartbeat
export const GET: RequestHandler = ({ params }) => {
  console.log(`Health check received: ${JSON.stringify(params)}`);
  return json({ status: "OK" });
};
