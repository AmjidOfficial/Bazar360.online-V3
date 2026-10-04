// Bazar360 Enterprise Theme Engine - Refined Luxury Tailwind Configuration
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
          primary: "var(--color-bg-primary)",
          secondary: "var(--color-bg-deep)",
          tertiary: "var(--color-surface-highest)",
          surface: "var(--color-surface)",
          elevated: "var(--color-surface-elevated)",
        },
        text: {
          main: "var(--color-text-main)",
          header: "var(--color-text-main)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
        },
        border: {
          main: "var(--color-outline)",
          subtle: "var(--color-outline)",
          accent: "var(--color-amber-accent)",
        },
        accent: {
          main: "var(--color-amber-accent)",
          hover: "var(--color-secondary-orange)",
          gold: "#C5A880",
          bronze: "#A47E53",
          obsidian: "#0B0F19",
        },
        brand: {
          blue: '#1E3A8A',
          gold: '#C5A880',
          darkBg: '#040812',
          lightBg: '#FAF9F6',
        },
      },
      borderRadius: {
        'luxury-sm': '10px',
        'luxury': '16px',
        'luxury-lg': '24px',
        'luxury-xl': '32px',
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        heading: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
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
        'luxury-subtle': '0 2px 10px -2px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'luxury-card': '0 8px 30px -4px rgba(0, 0, 0, 0.04), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'luxury-hover': '0 16px 40px -6px rgba(197, 168, 128, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'luxury-glow': '0 0 35px rgba(197, 168, 128, 0.15)',
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
