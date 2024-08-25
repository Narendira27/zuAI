/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-violet": "#6947BF",
        "light-blue": "#E5ECF3",
      },
    },
  },
  plugins: [],
};
