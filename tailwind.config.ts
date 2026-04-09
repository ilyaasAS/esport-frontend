import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        arena: {
          950: '#0f172a',
          900: '#111827',
          800: '#1f2937',
        },
        neon: {
          400: '#38bdf8',
        },
      },
    },
  },
  plugins: [],
}

export default config
