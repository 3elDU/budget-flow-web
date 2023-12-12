/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./**/*.{vue,js}"],
  theme: {
    fontFamily: {
      sans: ["Inter"],
    },
    extend: {
      colors: {
        primaryfg: "var(--primaryfg)",
        primarybg: "var(--primarybg)",
        secondaryfg: "var(--secondaryfg)",
        primary: "var(--primary-color)",
        secondary: "var(--secondary-color)",
        accent: "var(--accent)",
        success: "var(--success)",
        error: "var(--error)",
      },
    },
  },
};
