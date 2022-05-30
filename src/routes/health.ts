import type { RequestHandler } from "@sveltejs/kit";

// simple healthcheck endpoint for use by ONS CI as heartbeat
export const get: RequestHandler = async ({ params }) => {
  console.log(`Health check received: ${params}`);
  return {
    status: 200,
    body: {
      status: "OK",
    },
  };
};
