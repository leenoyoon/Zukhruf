/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        darkBg: "#0B0C10",
        cardBg: "#1F2128",
        accent: {
          orange: "#F47521",
          glow: "#FF914D",
        },
      },
      backgroundImage: {
        "orange-gradient": "linear-gradient(135deg, #F47521 0%, #FF914D 100%)",
      },
      boxShadow: {
        "orange-glow": "0 0 20px rgba(244, 117, 33, 0.4)",
      },
    },
  },
  plugins: [],
};
