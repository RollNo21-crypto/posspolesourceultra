/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00AEEF',
          50: '#E6F7FE',
          100: '#CCF0FD',
          200: '#99E1FB',
          300: '#66D2F9',
          400: '#33C3F7',
          500: '#00AEEF', // Main primary color
          600: '#008BBF',
          700: '#00688F',
          800: '#004660',
          900: '#002330',
        },
        secondary: {
          DEFAULT: '#D9D9D9',
          50: '#FFFFFF',
          100: '#F7F7F7',
          200: '#EBEBEB',
          300: '#E3E3E3',
          400: '#D9D9D9', // Main secondary color
          500: '#BFBFBF',
          600: '#A6A6A6',
          700: '#8C8C8C',
          800: '#737373',
          900: '#595959',
        },
        accent: {
          DEFAULT: '#000000',
          soft: '#333333',
          muted: '#666666',
        },
        background: {
          DEFAULT: '#FFFFFF',
          alt: '#F5F5F5',
        }
      },
    },
  },
  plugins: [],
};