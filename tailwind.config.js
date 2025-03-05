/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      backgroundSize: {
        'error-icon-size': '18px 18px',
      },
      backgroundPosition: {
        'error-icon-pos': 'center right 12px',
      },
      colors: {
        blue: {
          500: '#006AFF',
          600: '#0055CC'
        },
        flame: {
          300: '#ea868f',
          500: '#f96f6f'
        },
        midnight: {
          600: '#294668',
          700: '#1B3453',
          800: '#152941',
          900: '#122336',
          950: '#0F1E2E',
        }
      }
    },
  },
  plugins: [],
}

