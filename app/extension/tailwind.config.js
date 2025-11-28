/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx}",
    "../ui/src/**/*.{ts,tsx}",
    "../core/src/**/*.{ts,tsx}"
  ],
  presets: [require("../../tailwind.config.js")]
}

