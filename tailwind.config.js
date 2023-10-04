module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', 'node_modules/preline/dist/*.js'],
    darkMode: 'class', // or 'media' or 'class'
    theme: {
      container: {
        padding: '2rem',
      },
      extend: {
      },
    },
    variants: {
      extend: {},
    },
    plugins: [
      require('preline/plugin'),
      require('@tailwindcss/forms')
    ],
  };