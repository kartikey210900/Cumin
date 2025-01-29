/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure all React files are scanned
    "./public/index.html", // If you are using plain HTML files or the index.html
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
