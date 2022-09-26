import type { RequestHandler } from "@sveltejs/kit";

// return values from env set in runtime env (default to values set at build time if runtime env is missing var)
export const get: RequestHandler = async () => {
  return {
    status: 200,
    body: {
      envName: process.env["ENV_NAME"] || import.meta.env.VITE_ENV_NAME,
    },
  };
};
