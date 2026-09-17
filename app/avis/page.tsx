"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { styles } from "@/lib/styles";

const LABELS: Record<number, string> = {
  1: "Bof",
  2: "Correct",
  3: "Bien",
  4: "Très bien",
  5: "Excellent !",
};

export default function AvisPage() {
  const [note, setNote] = useState(0);
  const [hover, setHover] = useState(0);
  const [commentaire, setCommentaire] = useState("");
  const [erreur, setErreur] = useState(false);
  const [envoye, setEnvoye] = useState(false);
  const [loading, setLoading] = useState(false);

  const displayed = hover || note;

  async function handleSubmit() {
    if (note === 0) {
      setErreur(true);
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("avis_clients")
      .insert({ note, commentaire: commentaire.trim() || null });
    setLoading(false);
    if (error) {
      console.error(error);
      return;
    }
    setEnvoye(true);
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <nav style={styles.nav}>
          <Link href="/" style={styles.navLink}>
            Menu
          </Link>
          <Link href="/avis" style={styles.navLink}>
            Laisser un avis
          </Link>
          <Link href="/temoignages" style={styles.navLink}>
            Avis clients
          </Link>
        </nav>

        <div style={styles.card}>
          {envoye ? (
            <div style={{ textAlign: "center", padding: "12px 0" }}>
              <p style={{ ...styles.h1, fontSize: 20, marginBottom: 8 }}>
                Merci pour ton avis ! 🌴
              </p>
              <p style={styles.subtitle}>
                C'est précieux pour nous, à bientôt !
              </p>
            </div>
          ) : (
            <>
              <p style={{ ...styles.h1, fontSize: 20, textAlign: "left" }}>
                Ta soirée chez Kay Zouzou
              </p>
              <p style={{ ...styles.subtitle, textAlign: "left" }}>
                Donne ta note et dis-nous ce qui t'a plu.
              </p>

              <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                {[1, 2, 3, 4, 5].map((v) => (
                  <button
                    key={v}
                    type="button"
                    aria-label={`${v} étoile${v > 1 ? "s" : ""}`}
                    onClick={() => {
                      setNote(v);
                      setErreur(false);
                    }}
                    onMouseEnter={() => setHover(v)}
                    onMouseLeave={() => setHover(0)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 4,
                      cursor: "pointer",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 34,
                        lineHeight: 1,
                        color: v <= displayed ? "#D85A30" : "#F0997B",
                      }}
                    >
                      ★
                    </span>
                  </button>
                ))}
              </div>
              <p style={{ fontSize: 13, color: "#888780", minHeight: 18, marginBottom: 20 }}>
                {displayed ? LABELS[displayed] : "Touche une étoile pour noter"}
              </p>
              {erreur && (
                <p style={{ fontSize: 13, color: "#993C1D", marginTop: -14, marginBottom: 16 }}>
                  Choisis une note avant d'envoyer.
                </p>
              )}

              <label style={{ fontSize: 13, color: "#5F5E5A", display: "block", marginBottom: 6 }}>
                Un petit mot à nous laisser ?
              </label>
              <textarea
                rows={3}
                placeholder="Le mojito était top, l'ambiance parfaite..."
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                style={{
                  width: "100%",
                  resize: "vertical",
                  marginBottom: 20,
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #D3D1C7",
                  fontFamily: "'Work Sans', sans-serif",
                  fontSize: 14,
                }}
              />

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 8,
                  border: "none",
                  background: "#D85A30",
                  color: "#FFF",
                  fontWeight: 500,
                  fontSize: 15,
                  cursor: "pointer",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? "Envoi..." : "Envoyer mon avis"}
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
