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
          "open": "#4DA8B0",
          "open-hover": "#62BEC9",
          "Footer": "#D0E8D0",
          "Headings": "#403D39",
          "text": "#33393B",
          "border": "#CCAE7B",
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
          "input-hover": "#fbfbfb",
          "navtext-hover": "#6EA8A3",
          "icon-hover": "#C76B95",
          "lowest": "#E2E2E2",
          "low": "#D0E8D0",
          "medium": "#4DA8B0",
          "high": "#FAD2E1",
          "highest": "#CCAE7B",
          "lowest-hover": "#FEFEFE",
          "low-hover": "#B9D3BA",
          "medium-hover": "#62BEC9",
          "high-hover": "#FBC4D4",
          "highest-hover": "#F3ECE0"
        },
        dark: {
          "Main": "#20212C",
          "Secondary": "#2B2C37",
          "Footer": "#565F69",
          "open": "#9B5DE5",
          "open-hover": "#B07CE8",
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
          "navtext-hover": "#A3A3A3",
          "icon-hover": "#4D7298",
          "lowest": "#4A4A4A",
          "low": "#6D6875",
          "medium": "#4D7298",
          "high": "#9B5DE5",
          "highest": "#D4AF37",
          "lowest-hover": "#565F69",
          "low-hover": "#7F7985",
          "medium-hover": "#5E85B2",
          "high-hover": "#B07CE8",
          "highest-hover": "#E0B951"
        }
      }
    },
  },
  plugins: [],
}

