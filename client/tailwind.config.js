/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          primary: 'var(--color-primary)',
          secondary: 'var(--color-secondary)',
          accent: 'var(--color-accent)',
          'accent-hover': 'var(--color-accent-hover)',
          text: 'var(--color-text)',
          'text-secondary': 'var(--color-text-secondary)',
          bg: 'var(--color-bg)',
          'card-bg': 'var(--color-card-bg)',
          title: 'var(--color-title)',
        },
        maroon: {
          700: '#800000',
        },
        gold: {
          500: '#FFD700',
        },
        cream: {
          50: '#FFFDD0',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'shimmer': 'shimmer 3s infinite linear',
        'slow-spin': 'spin 30s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
      backgroundImage: {
        'theme-bg': 'var(--color-bg)',
        'theme-gradient': 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-bg) 50%, var(--color-primary) 100%)',
        'gold-silk': 'radial-gradient(circle at center, #FFD700 0%, #8B6508 100%)',
        'royal-maroon': 'linear-gradient(135deg, #4A0404 0%, #800000 50%, #4A0404 100%)',
      },
    },
  },
  plugins: [],
}
