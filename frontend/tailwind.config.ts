import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        surface: "hsl(var(--surface))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      fontFamily: {
        sans: ["Inter", "var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px -8px rgba(0, 0, 0, 0.55)",
        "glass-lg": "0 16px 48px -16px rgba(0, 0, 0, 0.6)",
        "glass-xl": "0 32px 64px -24px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255,255,255,0.06)",
        glow: "0 0 40px -8px hsl(var(--primary) / 0.25)",
        "glow-lg": "0 0 60px -12px hsl(var(--primary) / 0.35)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "shimmer-gradient": "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)",
      },
      animation: {
        "reveal-up": "reveal-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both",
        "float-gently": "float-gently 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "spin-slow": "spin 8s linear infinite",
        "fade-in-scale": "fade-in-scale 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) both",
        "slide-in-right": "slide-in-right 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) both",
      },
      transitionTimingFunction: {
        "bounce-soft": "cubic-bezier(0.2, 0.8, 0.2, 1)",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
