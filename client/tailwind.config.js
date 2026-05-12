/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        green: '#00C853',
        black: '#0A0A0A',
        surface: '#111111',
        card: '#1A1A1A',
        gold: '#FFD700',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, rgba(0,200,83,0.15) 0%, rgba(10,10,10,0.95) 100%)',
      },
    },
  },
  plugins: [],
};
