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
          "Main": "#F3ECE0",
          "Secondary": "#D0E8D0",
          "Footer": "#D0E8D0",
          "Headings": "#403D39",
          "text": "#33393B",
          "border": "#E4EBFA",
          "primary-button-bg": "#FAD2E1",
          "primary-button-text": "#403D39",
          "primary-button-border": "#E7B8C2",
          "primary-button-hover-bg": "#FBC4D4",
          "primary-button-hover-border": "#F0AEC0",
          "secondary-button-bg": "#D0E8D0",
          "secondary-button-text": "#403D39",
          "secondary-button-border": "#8DA897",
          "secondary-button-hover-bg": "#B9D3BA",
          "secondary-button-hover-border": "#9DB7A4",
          "input": "#FEFEFE",
          "input-hover": "#E2E2E2",
          "navtext-hover": "#767676"
        },
        dark: {
          "Main": "#20212C",
          "Secondary": "#2B2C37",
          "Footer": "#565F69",
          "Headings": "#FEFEFE",
          "text": "#C0C2C9",
          "border": "#3E3F4E",
          "primary-button-bg": "#4D7298",
          "primary-button-text": "#FEFEFE",
          "primary-button-border": "#3B5C7A",
          "primary-button-hover-bg": "#5E85B2",
          "primary-button-hover-border": "#DDA8B0",
          "secondary-button-bg": "#6D6875",
          "secondary-button-text": "#FEFEFE",
          "secondary-button-border": "#605A68",
          "secondary-button-hover-bg": "#7F7985",
          "secondary-button-hover-border": "#918AA2",
          "input": "#565F69",
          "input-hover": "#4A4A4A",
          "navtext-hover": "#A3A3A3"
        }
      }
    },
  },
  plugins: [],
}

