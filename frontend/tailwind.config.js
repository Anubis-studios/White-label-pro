/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyberBg: '#020202',
        cyberSurface: '#0A0A10',
        cyberSurfaceHover: '#12121E',
        neonPurple: '#9B00FF',
        electricBlue: '#00CFFF',
        plasmaRed: '#FF0033',
        cyberGold: '#FFD700',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
