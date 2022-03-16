module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        onsblue: '#206095',
        onsgreen: '#0f8243',
        onsyellow: '#fd0',
        onspale: '#f3f2f1',
        onsdark: '#414042',
        onsdarker: '#0a2032',
        onsreverse: '#f5f5f6',
      },
      // fontFamily: {
      //   sans: ["Open Sans", 'Helvetica', 'Arial', 'sans-serif'],
      // },      
      zIndex: {
        'abovemap': 1001
      },
      animation: {
        'delayedfadein': 'delayedFadeIn 2s ease',
      },
      keyframes: () => ({
        delayedFadeIn: {
          '0%':   { opacity: '0' },
          '90%':  { opacity: '0' },
          '100%': { opacity: '1' },
        },
      }),
    },
  },
  plugins: [],
}
