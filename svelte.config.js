import adapter from "@sveltejs/adapter-auto";
import dotenv from "dotenv";
import nodeAdapter from "@sveltejs/adapter-node";
import preprocess from "svelte-preprocess";

dotenv.config();

const getAdapter = () => {
  const skAdapter = process.env.SKADAPTER;
  if (skAdapter === "node") {
    console.log("Building with node adapter.");
    return nodeAdapter();
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
    vite: {
      server: {
        fs: {
          allow: ["data-tile-grids"],
        },
      },
    },
  },
};

export default config;
