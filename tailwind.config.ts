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
            color: '#404040',
            lineHeight: '1.75',
            maxWidth: 'none',
            h1: {
              fontSize: '2.25rem',
              fontWeight: '700',
              marginBottom: '1.5rem',
              color: '#1A1A1A',
            },
            h2: {
              fontSize: '1.875rem',
              fontWeight: '700',
              marginBottom: '1rem',
              color: '#1A1A1A',
            },
            h3: {
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '0.75rem',
              color: '#1A1A1A',
            },
            h4: {
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: '#1A1A1A',
            },
            p: { marginBottom: '1rem', lineHeight: '1.75' },
            ul: {
              listStyleType: 'disc',
              paddingLeft: '1.5rem',
              marginBottom: '1rem',
            },
            ol: {
              listStyleType: 'decimal',
              paddingLeft: '1.5rem',
              marginBottom: '1rem',
            },
            li: { marginBottom: '0.5rem', lineHeight: '1.5' },
            strong: { fontWeight: '700', color: '#1A1A1A' },
            em: { fontStyle: 'italic' },
            code: {
              backgroundColor: '#F5F5F5',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              fontFamily:
                'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            },
            pre: {
              backgroundColor: '#F5F5F5',
              padding: '1rem',
              borderRadius: '0.5rem',
              overflowX: 'auto',
              marginBottom: '1rem',
            },
            hr: {
              marginTop: '2rem',
              marginBottom: '2rem',
              borderColor: '#D1D5DB',
            },
            blockquote: {
              borderLeftWidth: '4px',
              borderLeftColor: '#3B82F6',
              paddingLeft: '1rem',
              fontStyle: 'italic',
              color: '#525252',
              backgroundColor: '#EFF6FF',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              borderTopRightRadius: '0.25rem',
              borderBottomRightRadius: '0.25rem',
            },
            a: {
              color: '#2563EB',
              textDecoration: 'underline',
              '&:hover': {
                color: '#1E40AF',
                transitionProperty: 'color',
                transitionDuration: '200ms',
              },
            },
            table: {
              width: '100%',
              borderCollapse: 'collapse',
              marginBottom: '1rem',
            },
            th: {
              border: '1px solid #D4D4D4',
              padding: '0.5rem 1rem',
              backgroundColor: '#F5F5F5',
              fontWeight: '700',
            },
            td: { border: '1px solid #D4D4D4', padding: '0.5rem 1rem' },
            img: {
              width: '100%',
              height: 'auto',
              borderRadius: '0.5rem',
              boxShadow:
                '0 2px 12px rgba(0,0,0,0.08), 0 2px 12px rgba(255,255,255,0.18)',
              marginTop: '1rem',
              marginBottom: '1rem',
              maxWidth: '100%',
              objectFit: 'contain',
            },
          },
        },
        // ---  [다크 모드 설정 추가] ---
        invert: {
          css: {
            color: '#E5E5E5', // text-gray-200
            h1: { color: '#FAFAFA' }, // text-gray-50
            h2: { color: '#FAFAFA' },
            h3: { color: '#FAFAFA' },
            h4: { color: '#FAFAFA' },
            strong: { color: '#FAFAFA' },
            code: {
              backgroundColor: '#262626', // bg-gray-800
              color: '#E5E5E5', // text-gray-200
            },
            pre: {
              backgroundColor: '#262626', // bg-gray-800
              color: '#E5E5E5', // text-gray-200
            },
            hr: { borderColor: '#525252' }, // border-gray-600
            blockquote: {
              borderLeftColor: '#60A5FA', // border-blue-400
              color: '#D4D4D4', // text-gray-300
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
            },
            a: {
              color: '#60A5FA', // text-blue-400
              '&:hover': { color: '#93C5FD' },
            },
            th: {
              border: '1px solid #525252', // border-gray-600
              backgroundColor: '#262626', // bg-gray-800
              color: '#FAFAFA', // text-gray-50
            },
            td: {
              border: '1px solid #525252', // border-gray-600
            },
            img: {
              boxShadow:
                '0 2px 12px rgba(255,255,255,0.08), 0 2px 12px rgba(0,0,0,0.18)',
            },
            ul: {
              li: {
                '&::marker': {
                  color: '#A3A3A3', // text-gray-400
                },
              },
            },
            ol: {
              li: {
                '&::marker': {
                  color: '#A3A3A3', // text-gray-400
                },
              },
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
        'midnight-black': '#1A1A1A',
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
          900: '#1A1A1A',
        },
        'btn-dark': '#1A1A1A',
        black: {
          DEFAULT: '#1A1A1A',
        },
      },
      boxShadow: {
        light: '0 2px 12px rgba(0,0,0,0.08), 0 2px 12px rgba(255,255,255,0.18)',
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
