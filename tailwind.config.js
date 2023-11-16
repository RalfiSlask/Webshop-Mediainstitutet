/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "garamond": "'EB Garamond', serif",
        "roboto": "'Roboto', sans-serif"
      },
      colors: {
        // Light Theme
        light: {
          "Header-L": "#D0E8D0",
          "Landing-L": "#F3ECE0",
          "Footer-L": "#CFCED6",
          "Headings-L": "#403D39",
          "text-L": "#33393B",
          "About-L": "#FFFDF7",
          "Projects-L": "E7EEF6", 
        },
        dark: {
          "Header-D": "#2B303A",
          "Landing-D": "#333940",
          "Footer-D": "#1B263B",
          "Headings-D": "#FEFEFE",
          "text-D": "#C0C2C9",
          "About-D": "#2A2D34",
          "Projects-D": "#3D4035", 
        }
      }
    },
  },
  plugins: [],
}

