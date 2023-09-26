/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      keyframes: { 
        zoomIn: {
          'from': { transform: "scale3d(0.3, 0.3, 0.3)" },
          "to": { transform: "scale3d(1, 1, 1)" },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      },
      animation: {
        zoomIn: 'zoomIn 0.5s ease-in-out',
        wiggle: 'wiggle 0.5s ease-in-out infinite',
      }

    },
    plugins: [
      require('@tailwindcss/typography'), 
      require('flowbite/plugin'),
    ],
  }
}