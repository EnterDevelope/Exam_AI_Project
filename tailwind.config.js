/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './features/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1756b6', // 로고에서 추출한 파란색
          dark: '#114488',
          light: '#eaf2fb',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: [
          'Noto Sans KR',
          'ui-sans-serif',
          'system-ui',
          'Apple SD Gothic Neo',
          'AppleGothic',
          'Malgun Gothic',
          'sans-serif',
        ],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        card: '0 2px 12px 0 rgba(23,86,182,0.08)',
        btn: '0 1.5px 6px 0 rgba(23,86,182,0.10)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
