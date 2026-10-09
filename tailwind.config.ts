// Bazar360 Enterprise Theme Engine - Single Unified Luxury Dark Design System
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0F172A",
          secondary: "#111827",
          tertiary: "#1E293B",
          surface: "#1E293B",
          elevated: "#334155",
        },
        text: {
          main: "#FFFFFF",
          header: "#FFFFFF",
          secondary: "#CBD5E1",
          muted: "#94A3B8",
        },
        border: {
          main: "#334155",
          subtle: "#1E293B",
          accent: "#2563EB",
        },
        accent: {
          main: "#2563EB",
          hover: "#3B82F6",
          blue: "#2563EB",
          lightBlue: "#3B82F6",
          gold: "#F59E0B",
          emerald: "#10B981",
        },
        brand: {
          primary: "#0F172A",
          secondary: "#111827",
          card: "#1E293B",
          accent: "#2563EB",
          hover: "#3B82F6",
          success: "#10B981",
          warning: "#F59E0B",
          danger: "#EF4444",
        },
      },
      borderRadius: {
        'luxury-sm': '10px',
        'luxury': '16px',
        'luxury-lg': '24px',
        'luxury-xl': '32px',
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        heading: ["Outfit", "Inter", "sans-serif"],
        display: ["Outfit", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      letterSpacing: {
        'tighter': '-0.035em',
        'tight': '-0.02em',
        'normal': '0',
        'luxury': '0.04em',
        'luxury-wide': '0.08em',
        'luxury-kicker': '0.14em',
        'extreme': '0.22em',
      },
      spacing: {
        '4.5': '1.125rem',
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      boxShadow: {
        'luxury-subtle': '0 2px 10px -2px rgba(0, 0, 0, 0.2)',
        'luxury-card': '0 8px 30px -4px rgba(0, 0, 0, 0.4)',
        'luxury-hover': '0 16px 40px -6px rgba(37, 99, 235, 0.25)',
        'luxury-glow': '0 0 35px rgba(37, 99, 235, 0.3)',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        'luxury': '280ms',
      },
    },
  },
  plugins: [],
};
