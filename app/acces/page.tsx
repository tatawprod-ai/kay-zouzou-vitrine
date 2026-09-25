"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AccesPage() {
  return (
    <Suspense fallback={null}>
      <AccesForm />
    </Suspense>
  );
}

function AccesForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setHasError(false);
    try {
      const res = await fetch("/api/acces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (res.ok) {
        const next = searchParams.get("next") || "/";
        router.push(next);
        router.refresh();
      } else {
        setHasError(true);
      }
    } catch {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.eyebrow}>ACCÈS PRIVÉ</div>
        <h1 style={styles.title}>Kay Zouzou</h1>
        <p style={styles.subtitle}>
          Cet espace est réservé à nos hôtes VIP. Merci de saisir le code
          communiqué pour découvrir le menu, les événements et nous laisser
          un avis.
        </p>

        <input
          type="password"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setHasError(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Code d'accès"
          style={styles.input}
        />

        {hasError && <p style={styles.error}>Code incorrect, réessaie.</p>}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          style={{ ...styles.button, opacity: loading ? 0.6 : 1 }}
        >
          {loading ? "Vérification..." : "Entrer"}
        </button>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100dvh",
    background: "#211C18",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    fontFamily: "'Work Sans', sans-serif",
  },
  container: { width: "100%", maxWidth: 380, textAlign: "center" },
  eyebrow: {
    fontFamily: "'JetBrains Mono', monospace",
    color: "#B8935A",
    fontSize: 12,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  title: {
    fontFamily: "'Fraunces', serif",
    fontSize: 34,
    color: "#E8DFCE",
    margin: "0 0 16px",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 1.6,
    color: "#A99B7F",
    margin: "0 0 36px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 16px",
    borderRadius: 8,
    border: "1px solid rgba(184,147,90,0.4)",
    background: "#2E2820",
    color: "#E8DFCE",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 15,
    textAlign: "center",
    letterSpacing: 2,
  },
  error: { fontSize: 12, color: "#C9694A", margin: "14px 0 0" },
  button: {
    width: "100%",
    marginTop: 20,
    padding: 14,
    border: "none",
    borderRadius: 8,
    background: "#D85A30",
    color: "#FBF6EF",
    fontWeight: 500,
    fontSize: 15,
    cursor: "pointer",
  },
};
