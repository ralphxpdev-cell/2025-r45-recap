/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './index.html',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        r45: {
          black: '#0a0a0a',
          white: '#f5f5f5',
          red: '#ff2d2d',
          green: '#00ff6a',
          gray: '#888888',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      fontFamily: {
        bebas: ['"Bebas Neue"', 'sans-serif'],
        noto: ['"Noto Sans KR"', 'sans-serif'],
      },
      letterSpacing: {
        'ultra-wide': '0.5em',
        'extra-wide': '0.4em',
        'super-wide': '0.3em',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
