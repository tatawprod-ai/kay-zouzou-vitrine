import type { CSSProperties } from "react";

export const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100dvh",
    background: "#FBF6EF",
    padding: "32px 20px",
    fontFamily: "'Work Sans', sans-serif",
  },
  container: { maxWidth: 480, margin: "0 auto" },
  nav: {
    display: "flex",
    gap: 16,
    justifyContent: "center",
    marginBottom: 32,
    fontSize: 13,
    fontFamily: "'JetBrains Mono', monospace",
  },
  navLink: { color: "#5F5E5A", textDecoration: "none" },
  h1: {
    fontFamily: "'Fraunces', serif",
    fontSize: 26,
    fontWeight: 500,
    margin: "0 0 4px",
    color: "#2C2C2A",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#5F5E5A",
    margin: "0 0 28px",
    textAlign: "center",
  },
  card: {
    background: "#FFFFFF",
    borderRadius: 16,
    padding: "20px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    marginBottom: 16,
  },
  itemName: {
    fontFamily: "'Fraunces', serif",
    fontSize: 18,
    fontWeight: 500,
    color: "#2C2C2A",
    margin: "0 0 4px",
  },
  itemDesc: { fontSize: 13, color: "#5F5E5A", margin: "0 0 8px" },
  itemPrice: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 14,
    color: "#D85A30",
  },
  stars: { color: "#D85A30", fontSize: 16, letterSpacing: 1 },
};
