export const designTokens = {
  spacing: {
    xxs: "0.25rem",
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    xxl: "3rem",
  },
  radius: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.25rem",
  },
  elevation: {
    subtle: "0 2px 8px rgba(2, 6, 23, 0.16)",
    medium: "0 10px 24px rgba(2, 6, 23, 0.22)",
    strong: "0 18px 40px rgba(2, 6, 23, 0.28)",
  },
  typography: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    xxl: "1.75rem",
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
  duration: {
    instant: 80,
    fast: 140,
    standard: 220,
    slow: 320,
  },
} as const;

export type DesignTokens = typeof designTokens;
