// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6D28D9',
          dark: '#8B5CF6'
        },
        accent: {
          DEFAULT: '#FCD34D',
          dark: '#FDE68A'
        }
      }
    }
  },
  plugins: []
};