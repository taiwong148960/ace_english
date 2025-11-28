/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./packages/*/src/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./web/**/*.{ts,tsx}",
    "./tabs/**/*.{ts,tsx}",
    "./popup/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      // Design System Color Palette
      colors: {
        // Primary Colors - Teal/Emerald theme
        primary: {
          DEFAULT: "#0E7569",
          hover: "#0B5C52",
          light: "#E0F2F1",
          50: "#ECFDF5",
          100: "#D1FAE5",
          500: "#0E7569",
          600: "#0B5C52",
          700: "#084C44"
        },
        // Secondary Accent Colors (pastel backgrounds)
        accent: {
          blue: "#E0F7FA",
          purple: "#F3E5F5",
          orange: "#FFF3E0",
          emerald: "#D1FAE5",
          rose: "#FFE4E6"
        },
        // Neutral Colors
        neutral: {
          background: "#F8F9FA",
          card: "#FFFFFF",
          border: "#E5E7EB",
          divider: "#F3F4F6",
          hover: "#F3F4F6"
        },
        // Text Colors
        text: {
          primary: "#1F2937",
          secondary: "#6B7280",
          tertiary: "#9CA3AF",
          inverse: "#FFFFFF"
        },
        // Functional Colors
        functional: {
          success: "#10B981",
          warning: "#F59E0B",
          error: "#EF4444",
          info: "#3B82F6"
        }
      },
      // Typography - Using distinctive fonts
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        serif: ['"DM Serif Display"', "Georgia", "serif"],
        display: ['"DM Serif Display"', "Georgia", "serif"],
        brand: ['"Outfit"', "system-ui", "sans-serif"]
      },
      fontSize: {
        // Display sizes for hero sections
        display: ["48px", { lineHeight: "1.1", fontWeight: "700" }],
        // Heading hierarchy
        h1: ["28px", { lineHeight: "1.2", fontWeight: "700" }],
        h2: ["20px", { lineHeight: "1.3", fontWeight: "600" }],
        h3: ["16px", { lineHeight: "1.4", fontWeight: "600" }],
        // Body text
        body: ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        small: ["12px", { lineHeight: "1.4", fontWeight: "500" }],
        xs: ["11px", { lineHeight: "1.4", fontWeight: "500" }]
      },
      // Border Radius
      borderRadius: {
        sm: "6px",
        md: "12px",
        lg: "16px",
        xl: "24px"
      },
      // Box Shadows with more depth
      boxShadow: {
        card: "0px 1px 3px rgba(0, 0, 0, 0.04), 0px 1px 2px rgba(0, 0, 0, 0.06)",
        "card-hover": "0px 10px 25px -5px rgba(0, 0, 0, 0.08), 0px 4px 6px -2px rgba(0, 0, 0, 0.04)",
        hover: "0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)",
        glow: "0 0 20px rgba(14, 117, 105, 0.15)",
        "inner-glow": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)"
      },
      // Spacing (8px base grid)
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
        "3xl": "64px"
      },
      // Layout
      width: {
        sidebar: "260px"
      },
      // Animation timing
      transitionDuration: {
        DEFAULT: "200ms",
        fast: "150ms",
        slow: "300ms"
      },
      // Custom keyframes for animations
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-10px)" },
          "100%": { opacity: "1", transform: "translateX(0)" }
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        }
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out forwards",
        "slide-in-left": "slide-in-left 0.3s ease-out forwards",
        "scale-in": "scale-in 0.2s ease-out forwards",
        shimmer: "shimmer 2s linear infinite"
      },
      // Backdrop blur
      backdropBlur: {
        xs: "2px"
      }
    }
  },
  plugins: []
}
