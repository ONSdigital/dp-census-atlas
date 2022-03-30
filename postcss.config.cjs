const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const purgecss = require("@fullhuman/postcss-purgecss");
const cssnano = require("cssnano");

const mode = process.env.NODE_ENV;
const dev = mode === "development";

module.exports = {
  plugins: [
    tailwindcss,
    autoprefixer,
    purgecss({
      content: ["./src/**/*.{html,js,svelte,ts}"],
    }),
    !dev &&
      cssnano({
        preset: "default",
      }),
  ],
};
