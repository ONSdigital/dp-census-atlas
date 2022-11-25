const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    screens: {
      xs: "475px",
      ...defaultTheme.screens,
    },
    extend: {
      borderRadius: {
        DEFAULT: "3px",
      },
      // https://ons-design-system.netlify.app/foundations/colours/
      colors: {
        // Primary brand pallete
        "ons-night-blue": "#003c57",
        "ons-ocean-blue": "#206095",
        "ons-aqua-teal": "#00a3a6",
        "ons-spring-green": "#a8bd3a",
        "ons-sky-blue": "#27a0cc",
        // Supporting palette
        "ons-leaf-green": "#0f8243",
        "ons-jaffa-orange": "#fa6401",
        "ons-neon-yellow": "#f0f762",
        "ons-ruby-red": "#d0021b",
        "ons-sun-yellow": "#fbc900",
        // Census 2021 theme palette
        "ons-census": "#902082",
        "ons-census-secondary": "#df0667",
        "ons-census-tertiary": "#3c388e",
        "ons-census-supporting": "#00a3a6",
        // Greyscale
        "ons-black": "#222222",
        "ons-grey-100": "#414042",
        "ons-grey-75": "#707071",
        "ons-grey-55": "#969697", // unofficial
        "ons-grey-35": "#bcbcbd",
        "ons-grey-15": "#e2e2e3",
        "ons-grey-5": "#f5f5f6",
        "ons-white": "#ffffff",
        // todo: remove these:
        onsdarkblue: "#003c57",
        onsblue: "#206095",
        onsteal: "#519BA8",
        onsgreen: "#0f8243",
        onsyellow: "#fd0",
        onspale: "#f3f2f1",
        onsdark: "#414042",
        onsdarker: "#0a2032",
        onsreverse: "#f5f5f6",
        onsgrey: "#f3f3f3",
        onsred: "#FF0000",
        onswhite: "#fff",
        onsblack: "#222222",
      },
      fontFamily: {
        sans: ["Open Sans", "Helvetica", "Arial", "sans-serif"],
      },
      zIndex: {
        abovemap: 1,
      },
      animation: {
        delayedfadein: "delayedFadeIn 2s ease",
      },
      keyframes: () => ({
        delayedFadeIn: {
          "0%": { opacity: "0" },
          "90%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      }),
    },
  },
  plugins: [],
};
