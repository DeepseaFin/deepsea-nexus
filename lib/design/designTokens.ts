export const designTokens = {
  color: {
    background: "#050d18",
    surface: "#0a192a",
    surfaceElevated: "#102338",
    border: "#27425f",
    text: "#e5eef8",
    textMuted: "#99aec4",
    primary: "#4cc9f0",
    success: "#22c55e",
    warning: "#f59e0b",
    danger: "#f43f5e",
    info: "#38bdf8",
  },
  radius: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.25rem",
    xxl: "1.5rem",
  },
  motion: {
    fast: "140ms",
    base: "220ms",
    slow: "360ms",
    easing: "cubic-bezier(0.2, 0.75, 0.2, 1)",
  },
  shadow: {
    sm: "0 10px 22px rgba(2, 8, 18, 0.22)",
    md: "0 18px 38px rgba(2, 8, 18, 0.28)",
    lg: "0 28px 60px rgba(2, 8, 18, 0.36)",
  },
  typography: {
    display: "clamp(2rem, 1.4rem + 2.4vw, 4rem)",
    h1: "clamp(1.9rem, 1.45rem + 1.8vw, 3.2rem)",
    h2: "clamp(1.55rem, 1.2rem + 1.2vw, 2.4rem)",
    body: "0.95rem",
    caption: "0.78rem",
  },
} as const;

export type DesignTokens = typeof designTokens;
