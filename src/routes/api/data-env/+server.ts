import { text, type RequestHandler } from "@sveltejs/kit";
import type { DataEnv } from "../../../types";

export const GET: RequestHandler = () => {
  const value = getDataEnv(process.env["ENV_NAME"] || import.meta.env.VITE_ENV_NAME);
  return text(value);
};

const getDataEnv = (envName: string): DataEnv => {
  if (["local", "netlify", "sandbox"].includes(envName)) {
    return "dev";
  } else if ((process.env["IS_PUBLISHING"] || "false").toLowerCase() === "true") {
    return "publishing"; // ONS publishing environment
  } else {
    return "web"; // ONS live environment
  }
};
