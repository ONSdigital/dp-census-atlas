module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    // screens: { xxs: "300px", xs: "400px", sm: "500px", md: "740px", lg: "980px", xl: "1300px", xxl: "1600px" },
    extend: {
      colors: {
        "ons-census": "#902082",
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
        abovemap: 1001,
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
