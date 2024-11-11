/** @type {import('tailwindcss').Config} */
export default {
  content: ['./views/**/*.pug',],
  theme: {
    extend: {
      colors:{
        negro:'#000000',
        blanco:'#FFFFFF',
        verdeclaro:'#8DFFCD',
        verdefuerte:'#68D89B',
        verde:'#4F9D69'
      }
    },
  },
  plugins: [],
}

