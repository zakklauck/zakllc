module.exports = {
  purge: [
     './components/**/*.{vue,js}',
     './layouts/**/*.vue',
     './pages/**/*.vue',
     './plugins/**/*.{js,ts}',
     './nuxt.config.{js,ts}',
   ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      white: '#fff',
      black: '#000',
      transparent: 'transparent',
    },
    fontFamily: {
      'times': ['Times New', 'serif'],
      'venus': ['Venus', 'sans-serif'],
    },
    fontSize: {
      base: ['1.2rem', '1.2'],
      'times-body': ['2rem', '1'],
      'venus-body': ['2rem', '1'],
    },
    flex: {
      '0-0': '0 0 auto',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    container: false,
  }
}
