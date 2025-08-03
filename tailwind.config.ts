import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import typography from '@tailwindcss/typography';

const customTypography = {
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
      typography: {
        DEFAULT: {
          css: {
            color: '#374151', // text-gray-700
            lineHeight: '1.75', // leading-relaxed
            maxWidth: 'none',
            h1: {
              fontSize: '2.25rem', // text-4xl
              fontWeight: '700', // font-bold
              marginBottom: '1.5rem', // mb-6
              color: '#111827', // text-gray-900
            },
            h2: {
              fontSize: '1.875rem', // text-3xl
              fontWeight: '700', // font-bold
              marginBottom: '1rem', // mb-4
              color: '#111827', // text-gray-900
            },
            h3: {
              fontSize: '1.5rem', // text-2xl
              fontWeight: '700', // font-bold
              marginBottom: '0.75rem', // mb-3
              color: '#111827', // text-gray-900
            },
            h4: {
              fontSize: '1.25rem', // text-xl
              fontWeight: '600', // font-semibold
              marginBottom: '0.5rem', // mb-2
              color: '#111827', // text-gray-900
            },
            p: {
              marginBottom: '1rem', // mb-4
              lineHeight: '1.75', // leading-7
            },
            ul: {
              listStyleType: 'disc',
              paddingLeft: '1.5rem', // pl-6
              marginBottom: '1rem', // mb-4
            },
            ol: {
              listStyleType: 'decimal',
              paddingLeft: '1.5rem', // pl-6
              marginBottom: '1rem', // mb-4
            },
            li: {
              marginBottom: '0.5rem', // mb-2
              lineHeight: '1.5', // leading-6
            },
            strong: {
              fontWeight: '700', // font-bold
              color: '#111827', // text-gray-900
            },
            em: {
              fontStyle: 'italic',
            },
            code: {
              backgroundColor: '#F3F4F6', // bg-gray-100
              padding: '0.25rem 0.5rem', // px-2 py-1
              borderRadius: '0.25rem', // rounded
              fontSize: '0.875rem', // text-sm
              fontFamily:
                'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace', // font-mono
            },
            pre: {
              backgroundColor: '#F3F4F6', // bg-gray-100
              padding: '1rem', // p-4
              borderRadius: '0.5rem', // rounded-lg
              overflowX: 'auto',
              marginBottom: '1rem', // mb-4
            },
            hr: {
              marginTop: '2rem', // my-8
              marginBottom: '2rem',
              borderColor: '#D1D5DB', // border-gray-300
            },
            blockquote: {
              borderLeftWidth: '4px', // border-l-4
              borderLeftColor: '#3B82F6', // border-blue-500
              paddingLeft: '1rem', // pl-4
              fontStyle: 'italic',
              color: '#4B5563', // text-gray-600
              backgroundColor: '#EFF6FF', // bg-blue-50
              paddingTop: '0.5rem', // py-2
              paddingBottom: '0.5rem',
              borderTopRightRadius: '0.25rem', // rounded-r
              borderBottomRightRadius: '0.25rem',
            },
            a: {
              color: '#2563EB', // text-blue-600
              textDecoration: 'underline',
              '&:hover': {
                color: '#1E40AF', // hover:text-blue-800
                transitionProperty: 'color',
                transitionDuration: '200ms',
              },
            },
            table: {
              width: '100%', // w-full
              borderCollapse: 'collapse', // border-collapse
              marginBottom: '1rem', // mb-4
            },
            th: {
              border: '1px solid #D1D5DB', // border border-gray-300
              padding: '0.5rem 1rem', // px-4 py-2
              backgroundColor: '#F3F4F6', // bg-gray-100
              fontWeight: '700', // font-bold
            },
            td: {
              border: '1px solid #D1D5DB', // border border-gray-300
              padding: '0.5rem 1rem', // px-4 py-2
            },
            img: {
              width: '100%', // w-full
              height: 'auto', // h-auto
              borderRadius: '0.5rem', // rounded-lg
              boxShadow:
                '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // shadow-md
              marginTop: '1rem', // my-4
              marginBottom: '1rem',
              maxWidth: '100%', // max-w-full
              objectFit: 'contain', // object-contain
            },
          },
        },
      },
      animation: {
        glow: 'glow 2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 1.5s ease-in-out infinite',
        blink: 'blink 3s ease-in-out infinite',
        'blink-fast': 'blink 0.5s ease-in-out infinite',
        'blink-slow': 'blink 2s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(100%)' },
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow:
              '0 0 5px rgba(152,255,88,0.3), 0 0 10px rgba(152,255,88,0.2), 0 0 30px rgba(152,255,88,0.1)',
          },
          '50%': {
            boxShadow:
              '0 0 10px rgba(152,255,88,0.5), 0 0 20px rgba(152,255,88,0.3), 0 0 30px rgba(152,255,88,0.3)',
          },
        },
        blink: {
          '0%, 50%': { opacity: '1' },
          '25%, 75%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
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
        red: {
          100: '#FFE4E6',
          200: '#FFB8BB',
          300: '#FF8B90',
          400: '#F85A60',
          500: '#F3353D',
          600: '#ED1B23',
          700: '#C90D15',
          800: '#A4060C',
          900: '#8A0308',
          DEFAULT: '#ED1B23',
        },
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
    typography,
    plugin(({ addUtilities }) => {
      const newUtilities: Record<
        string,
        { fontSize: string; fontWeight?: string }
      > = {};

      Object.entries(customTypography).forEach(([type, sizes]) => {
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
