import adapter from "@sveltejs/adapter-auto";
import dotenv from "dotenv";
import netlifyAdapter from "@sveltejs/adapter-netlify";
import nodeAdapter from "@sveltejs/adapter-node";
import preprocess from "svelte-preprocess";

dotenv.config();

const getAdapter = () => {
  const skAdapter = process.env.SKADAPTER;
  if (skAdapter === "node") {
    console.log("Building with node adapter.");
    return nodeAdapter();
  } else if (skAdapter === "netlify") {
    /* use netlify adapter pinned to v1.x here, as adapter-auto selects a netlify adapter that is incompatible with
    sveltekit <1.5 (and at time of writing sveltekit 1.5 did not work with our node adapter + /census/maps basepath
    setup). This should be removed when the compatibility issue is solved, as netlify recommends you just use
    adapter-auto to build sveltekit */
    console.log("Building with netlify adapter.");
    return netlifyAdapter();
  } else {
    console.log("Building with automatic adapter.");
    return adapter();
  }
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess({
    postcss: true,
  }),
  kit: {
    adapter: getAdapter(),
    paths: {
      base: process.env.VITE_APP_BASE_PATH,
    },
  },
};

export default config;
