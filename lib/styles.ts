import type { CSSProperties } from "react";

export const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100dvh",
    background: "#FBF6EF",
    fontFamily: "'Work Sans', sans-serif",
  },
  container: { maxWidth: 480, margin: "0 auto" },
  nav: {
    display: "flex",
    gap: 28,
    alignItems: "center",
    fontSize: 14,
    color: "#E8DFCE",
  },
  navLink: { color: "#E8DFCE", textDecoration: "none", opacity: 0.85 },
  cta: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 24px",
    borderRadius: 4,
    fontSize: 14,
    fontWeight: 500,
    background: "#D85A30",
    color: "#FBF6EF",
  },
  h1: {
    fontFamily: "'Fraunces', serif",
    fontWeight: 500,
    margin: "0 0 4px",
    color: "#2C2C2A",
  },
  subtitle: { fontSize: 14, color: "#5F5E5A", margin: "0 0 28px" },
  itemName: {
    fontFamily: "'Fraunces', serif",
    fontSize: 19,
    color: "#1A1A1A",
  },
  itemDesc: { fontSize: 13, color: "#6B6259", marginTop: 3 },
  price: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 15,
    color: "#000000",
  },
  chip: {
    display: "inline-flex",
    padding: "3px 10px",
    borderRadius: 100,
    border: "1px solid rgba(184,147,90,0.5)",
    fontSize: 11,
    color: "#9C6B2E",
  },
};
