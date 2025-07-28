import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const typography = {
  heading: {
    xs: '14px',
    sm: '16px',
    md: '20px',
    lg: '24px',
    xl: '30px',
    '2xl': '36px',
    '3xl': '48px',
    '4xl': '60px',
  },

  regular: {
    '2xs': '10px',
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
    '6xl': '60px',
    '7xl': '72px',
    '8xl': '96px',
    '9xl': '128px',
  },

  medium: {
    '2xs': '10px',
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
    '6xl': '60px',
    '7xl': '72px',
    '8xl': '96px',
    '9xl': '128px',
  },
};

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // class 기반 다크 모드
  theme: {
    extend: {
      fontFamily: {
        'noto-sans-kr': ['Noto Sans KR', 'sans-serif'],
        sans: ['Noto Sans KR', 'sans-serif'],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        'midnight-black': '#121212',
        'signal-brown': '#5C4531',
        'burst-lime': '#98FF58',
        'candy-pink': '#FF66C4',
        'packet-golden': '#D09436',
        'cloud-white': '#F3F3F3',
        'teal-green': '#38CB89',
        'surface-light': '#F3F5F7',
        red: '#ED1B23',
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        'btn-dark': '#1F1F1F',
      },
      boxShadow: {
        light: '0 4px 16px rgba(163, 163, 163, 0.25)', // gray-400(회색 400), 불투명도 25%
      },
      width: {
        'card-sm': '152px',
        'card-md': '238px',
        'btn-sm': '133px',
        'btn-md': '214px',
      },
      height: {
        'card-sm': '203px',
        'card-md': '348px',
        'btn-sm': '26px',
        'btn-md': '40px',
      },
      borderRadius: {
        card: '24px',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      const newUtilities: Record<
        string,
        { fontSize: string; fontWeight?: string }
      > = {};

      Object.entries(typography).forEach(([type, sizes]) => {
        Object.entries(sizes).forEach(([size, value]) => {
          const key = `.text-${type}-${size}`;

          newUtilities[key] = { fontSize: value };
        });
      });

      addUtilities(newUtilities);
    }),
  ],
};

export default config;
