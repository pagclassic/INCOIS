/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          900: '#0B486B',
          700: '#176B87',
          600: '#1D7A95',
        },
        teal: {
          500: '#2CA6A4',
          400: '#39BEBB',
        },
        warning: {
          500: '#FF6B35',
        },
      },
    },
  },
  plugins: [],
}

