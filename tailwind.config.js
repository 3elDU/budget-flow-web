/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./**/*.{vue,js}"],
  plugins: [require("@tailwindcss/forms")],
  theme: {
    fontFamily: {
      sans: ["Inter"],
    },
    extend: {
      colors: {
        primaryfg: "#E1EBED",
        primarybg: "#010104",
        secondaryfg: "#B0B5B6",
        primary: "#534DC6",
        "primary-d": "#292663",
        secondary: "#19182B",
        "secondary-d": "#131320",
        accent: "#C07BBC",
        success: "#639A55",
        error: "#C95B5B",
      },
    },
  },
};
