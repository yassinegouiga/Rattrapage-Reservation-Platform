/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'uca-green': '#248f43',
        'uca-brown': '#a35222',
        'uca-light-green': '#34b256',
        'uca-light-brown': '#c86830',
        'uca-gray': '#f3f4f6',
      }
    },
  },
  plugins: [],
}
