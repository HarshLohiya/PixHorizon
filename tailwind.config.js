/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        peaches: ['"Peaches and Cream"', "cursive"],
        inter: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      textShadow: {
        default: "2px 2px 4px rgba(0, 0, 0, 0.5)",
        md: "3px 3px 5px rgba(0, 0, 0, 0.4)",
        lg: "4px 4px 6px rgba(0, 0, 0, 0.5)",
      },
      colors: {
        headerBg: "#EEE8D8", // Replace with your desired color code
      },
    },
  },
  plugins: [require("tailwindcss-textshadow")],
};
