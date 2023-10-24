const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(function ({ addBase, theme }) {
      addBase({
        'h1': { fontSize: theme('fontSize.2xl'), fontWeight: 500 },
        'h2': { fontSize: theme('fontSize.xl'), fontWeight: 500 },
        'h3': { fontSize: theme('fontSize.lg'), fontWeight: 500 },
      })
    })
  ],
}