import type { Load } from "@sveltejs/kit";
import { redirectIfNecessary } from "../../../../../../../redirects";

export const load: Load = ({ url }) => {
  redirectIfNecessary(url);
};
