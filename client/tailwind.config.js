/** @type {import('tailwindcss').Config} */
export default {
  content: ["**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        // Add your custom color names and values here
        brand: {
          red: "#F76C5E",
          green: "#6DBAA1"
        },
      },
      boxShadow: {
        'offset-4': '0px 4px 8px rgba(0, 0, 0, 0.25)',
      }
    }
  }
}