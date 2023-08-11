module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', 'node_modules/preline/dist/*.js'],
    darkMode: 'class', // or 'media' or 'class'
    theme: {
      extend: {
        fontFamily: {
          sans: [
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji',
          ],
        },
      },
    },
    variants: {
      extend: {},
    },
    plugins: [
      require('preline/plugin'),
    ],
  };