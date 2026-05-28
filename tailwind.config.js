/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'oklch(10.5% 0.018 342 / <alpha-value>)',
        night: 'oklch(14.5% 0.026 344 / <alpha-value>)',
        wine: 'oklch(29% 0.09 355 / <alpha-value>)',
        blush: 'oklch(69% 0.21 356 / <alpha-value>)',
        roseglow: 'oklch(74% 0.18 6 / <alpha-value>)',
        pearl: 'oklch(96% 0.012 348 / <alpha-value>)',
        mist: 'oklch(80% 0.026 348 / <alpha-value>)',
      },
      boxShadow: {
        'romance-button':
          '0 18px 48px oklch(65% 0.23 356 / 0.32), inset 0 1px 0 oklch(100% 0 0 / 0.28)',
        'romance-panel':
          '0 32px 80px oklch(4% 0.01 342 / 0.52), 0 0 80px oklch(62% 0.2 356 / 0.16)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
    },
  },
  plugins: [],
}
