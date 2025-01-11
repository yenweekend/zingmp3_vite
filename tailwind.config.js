/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      gridTemplateRows: {
        8: "repeat(8,minmax(0, 1fr))",
        9: "repeat(9,minmax(0, 1fr))",
        10: "repeat(10,minmax(0, 1fr))",
        11: "repeat(11,minmax(0, 1fr))",
        12: "repeat(12,minmax(0, 1fr))",
        13: "repeat(13,minmax(0, 1fr))",
        14: "repeat(14,minmax(0, 1fr))",
        15: "repeat(15,minmax(0, 1fr))",
      },
      keyframes: {
        appear: {
          "0%": {
            transform: "translateY(100%)",
          },
          "100%": {
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        appear: "appear 1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both ",
      },
      backgroundImage: {
        "img-logo-theme": "url(var(--img-logo-mp3-custom))",
      },
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      "min-1130": "1130px", // Add a custom breakpoint
      "min-1220": "1220px", // Add a custom breakpoint
      "min-1350": "1350px", // Add a custom breakpoint
      "min-1280": "1280px", // Add a custom breakpoint
      "min-1250": "1250px", // Add a custom breakpoint
      "max-1130": { max: "1130px" },
      "max-1330": { max: "1330px" },
      "max-860": { max: "860px" },
      "max-1200": { max: "1200px" },
      "max-1350": { max: "1350px" },
      "max-1020": { max: "1020px" },
      "max-1250": { max: "1250px" },
      "max-1280": { max: "1280px" },
    },
  },
  plugins: [],
};
