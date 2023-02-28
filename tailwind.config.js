/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
  theme: {
    extend: {
      gradientColorStops: {
        'blue-purple': ['#667eea', '#764ba2'],
      },
    },
  },
  variants: {
    extend: {
      borderWidth: ['hover'],
      backgroundColor: ['hover'],
      textColor: ['hover'],
    },
  },
}
