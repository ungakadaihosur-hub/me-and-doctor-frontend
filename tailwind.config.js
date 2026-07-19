/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF6EE',
        parchment: '#F2ECDC',
        ink: '#16233D',
        'ink-soft': '#2A3A5C',
        brass: '#B8935A',
        'brass-deep': '#8C6D3F',
        sage: '#4B6455',
        clay: '#A6483A',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        tamil: ['"Noto Sans Tamil"', '"Inter"', 'sans-serif'],
      },
      boxShadow: {
        chit: '0 1px 0 rgba(22,35,61,0.06), 0 6px 16px rgba(22,35,61,0.08)',
      },
    },
  },
  plugins: [],
};
