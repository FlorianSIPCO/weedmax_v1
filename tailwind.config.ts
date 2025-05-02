import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#242B6F",
        secondary: "#D00BA9",
      },
    },
    keyframes: {
      spinSlow: {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
      },
      spinFast: {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
      },
      l26: {
        "12.5%": {
          boxShadow: `19px -19px 0 0px #a8e6cf, 38px -19px 0 0px #ffb6b9, 57px -19px 0 5px #ffdac1,
                      19px 0 0 5px #34db34, 38px 0 0 0px #ffb6b9, 57px 0 0 5px #ffdac1,
                      19px 19px 0 0px #a8e6cf, 38px 19px 0 0px #ffb6b9, 57px 19px 0 0px #ffdac1`,
        },
        "25%": {
          boxShadow: `19px -19px 0 5px #a8e6cf, 38px -19px 0 0px #ffb6b9, 57px -19px 0 5px #ffdac1,
                      19px 0 0 0px #a8e6cf, 38px 0 0 0px #ffb6b9, 57px 0 0 0px #ffdac1,
                      19px 19px 0 0px #34db34, 38px 19px 0 5px #ffb6b9, 57px 19px 0 0px #ffdac1`,
        },
        "50%": {
          boxShadow: `19px -19px 0 5px #34db34, 38px -19px 0 5px #ffb6b9, 57px -19px 0 0px #ffdac1,
                      19px 0 0 0px #a8e6cf, 38px 0 0 0px #ffb6b9, 57px 0 0 0px #ffdac1,
                      19px 19px 0 0px #a8e6cf, 38px 19px 0 0px #ffb6b9, 57px 19px 0 5px #ffdac1`,
        },
        "62.5%": {
          boxShadow: `19px -19px 0 0px #a8e6cf, 38px -19px 0 0px #ffb6b9, 57px -19px 0 0px #ffdac1,
                      19px 0 0 5px #34db34, 38px 0 0 0px #ffb6b9, 57px 0 0 0px #ffdac1,
                      19px 19px 0 0px #a8e6cf, 38px 19px 0 5px #ffb6b9, 57px 19px 0 5px #ffdac1`,
        },
        "75%": {
          boxShadow: `19px -19px 0 0px #a8e6cf, 38px -19px 0 5px #ffb6b9, 57px -19px 0 0px #ffdac1,
                      19px 0 0 0px #a8e6cf, 38px 0 0 0px #ffb6b9, 57px 0 0 5px #ffdac1,
                      19px 19px 0 0px #34db34, 38px 19px 0 0px #ffb6b9, 57px 19px 0 5px #ffdac1`,
        },
        "87.5%": {
          boxShadow: `19px -19px 0 0px #34db34, 38px -19px 0 5px #ffb6b9, 57px -19px 0 0px #ffdac1,
                      19px 0 0 0px #a8e6cf, 38px 0 0 5px #ffb6b9, 57px 0 0 0px #ffdac1,
                      19px 19px 0 5px #a8e6cf, 38px 19px 0 0px #ffb6b9, 57px 19px 0 0px #ffdac1`,
        },
      },
      'l26-dark': {
        '12.5%': {
          boxShadow: `
            19px -19px 0 0px #a8e6cf, 38px -19px 0 0px #977119, 57px -19px 0 5px #321382,
            19px 0 0 5px #34db34, 38px 0 0 0px #977119, 57px 0 0 5px #321382,
            19px 19px 0 0px #a8e6cf, 38px 19px 0 0px #977119, 57px 19px 0 0px #321382`
        },
        '25%': {
          boxShadow: `
            19px -19px 0 5px #a8e6cf, 38px -19px 0 0px #977119, 57px -19px 0 5px #321382,
            19px 0 0 0px #03551b, 38px 0 0 0px #977119, 57px 0 0 0px #321382,
            19px 19px 0 0px #34db34, 38px 19px 0 5px #977119, 57px 19px 0 0px #321382`
        },
        '50%': {
          boxShadow: `
            19px -19px 0 5px #03551b, 38px -19px 0 5px #c18c5d, 57px -19px 0 0px #321382,
            19px 0 0 0px #a8e6cf, 38px 0 0 0px #c18c5d, 57px 0 0 0px #321382,
            19px 19px 0 0px #34db34, 38px 19px 0 0px #c18c5d, 57px 19px 0 5px #321382`
        },
        '62.5%': {
          boxShadow: `
            19px -19px 0 0px #34db34, 38px -19px 0 0px #d3bf07, 57px -19px 0 0px #7059ab,
            19px 0 0 5px #a8e6cf, 38px 0 0 0px #d3bf07, 57px 0 0 0px #7059ab,
            19px 19px 0 0px #03551b, 38px 19px 0 5px #d3bf07, 57px 19px 0 5px #7059ab`
        },
        '75%': {
          boxShadow: `
            19px -19px 0 0px #a8e6cf, 38px -19px 0 5px #d3bf07, 57px -19px 0 0px #7059ab,
            19px 0 0 0px #34db34, 38px 0 0 0px #d3bf07, 57px 0 0 5px #7059ab,
            19px 19px 0 0px #03551b, 38px 19px 0 0px #d3bf07, 57px 19px 0 5px #7059ab`
        },
        '87.5%': {
          boxShadow: `
            19px -19px 0 0px #34db34, 38px -19px 0 5px #d3bf07, 57px -19px 0 0px #7059ab,
            19px 0 0 0px #a8e6cf, 38px 0 0 5px #d3bf07, 57px 0 0 0px #7059ab,
            19px 19px 0 5px #03551b, 38px 19px 0 0px #d3bf07, 57px 19px 0 0px #7059ab`
        },
      },
    },
    animation: {
      'spin-slow': 'spinSlow 1s linear infinite',
      'spin-fast': 'spinFast 0.5s linear infinite reverse',
      'l26': "l26 3s linear infinite",
      'l26-dark': 'l26-dark 3s linear infinite',
    },
  },
  plugins: [],
} satisfies Config;
