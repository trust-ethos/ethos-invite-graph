export default {
  selfURL: import.meta.url,
  darkMode: "class" as const,
  theme: {
    extend: {
      colors: {
        // 90s Styrofoam Cup Palette
        retro: {
          teal: "#00CED1", // Classic cup teal
          cyan: "#00FFFF", // Bright cyan
          purple: "#8A2BE2", // Deep purple
          magenta: "#FF1493", // Hot magenta
          pink: "#FF1493", // Hot magenta (matches View Profile button)
          blue: "#4169E1", // Royal blue
          lime: "#39FF14", // Electric lime green
          yellow: "#FFD700", // Gold
          orange: "#FF4500", // Orange red
        },
        // Background colors
        cream: "#F5F5DC", // Cream white like cup
        offwhite: "#FFFEF7", // Slightly warm white

        // Grays for text and subtle elements
        gray: {
          950: "#1a1a1a",
          900: "#2d2d2d",
          800: "#404040",
          750: "#525252",
          700: "#666666",
          600: "#808080",
          500: "#999999",
          400: "#b3b3b3",
          300: "#cccccc",
          200: "#e6e6e6",
          100: "#f3f3f3",
          50: "#fafafa",
        },
      },
      fontFamily: {
        sans: ["Comic Sans MS", "Arial", "system-ui", "sans-serif"], // More 90s feeling
        mono: ["Courier New", "monospace"],
        retro: ["Impact", "Arial Black", "sans-serif"], // Bold 90s headers
      },
      fontSize: {
        "xs": "0.75rem",
        "sm": "0.875rem",
        "base": "1rem",
        "lg": "1.125rem",
        "xl": "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "3.75rem",
        "7xl": "4.5rem",
        "8xl": "6rem",
        "9xl": "8rem",
      },
      animation: {
        "bounce-slow": "bounce 2s infinite",
        "pulse-fast": "pulse 1s infinite",
        "wiggle": "wiggle 1s ease-in-out infinite",
        "retro-glow": "retro-glow 2s ease-in-out infinite alternate",
        "slide-in": "slide-in 0.5s ease-out",
        "zoom-in": "zoom-in 0.3s ease-out",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "retro-glow": {
          "from": {
            boxShadow:
              "0 0 20px rgba(0, 206, 209, 0.5), 0 0 40px rgba(138, 43, 226, 0.3)",
          },
          "to": {
            boxShadow:
              "0 0 30px rgba(0, 206, 209, 0.8), 0 0 60px rgba(138, 43, 226, 0.5)",
          },
        },
        "slide-in": {
          "from": { transform: "translateY(-10px)", opacity: "0" },
          "to": { transform: "translateY(0)", opacity: "1" },
        },
        "zoom-in": {
          "from": { transform: "scale(0.95)", opacity: "0" },
          "to": { transform: "scale(1)", opacity: "1" },
        },
      },
      backgroundImage: {
        "retro-pattern":
          `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%2300CED1' fill-opacity='0.1'%3e%3cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
        "cup-swoosh":
          "linear-gradient(45deg, #00CED1 0%, #8A2BE2 50%, #FF1493 100%)",
        "retro-gradient":
          "linear-gradient(135deg, #00FFFF 0%, #8A2BE2 25%, #FF1493 50%, #FFD700 75%, #32CD32 100%)",
      },
      boxShadow: {
        "retro": "4px 4px 0px #8A2BE2",
        "retro-lg": "8px 8px 0px #8A2BE2",
        "neon": "0 0 20px rgba(0, 206, 209, 0.6)",
        "neon-purple": "0 0 20px rgba(138, 43, 226, 0.6)",
      },
    },
  },
};
