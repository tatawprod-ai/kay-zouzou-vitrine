"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const LABELS: Record<number, string> = {
  1: "Bof",
  2: "Correct",
  3: "Bien",
  4: "Très bien",
  5: "Excellent !",
};

export default function AvisForm() {
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
    <div style={{ position: "relative", padding: "96px 32px", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(rgba(33,26,20,0.55), rgba(33,26,20,0.55)), url(/avis-bg.jpg) center/cover",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 420,
          margin: "0 auto",
          background: "#FFFFFF",
          borderRadius: 12,
          padding: "40px 32px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {envoye ? (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <p style={{ fontFamily: "'Fraunces', serif", fontSize: 20, margin: "0 0 8px" }}>Merci pour ton avis ! 🌴</p>
            <p style={{ fontSize: 14, color: "#8A8377", margin: 0 }}>C&apos;est précieux pour nous, à bientôt !</p>
          </div>
        ) : (
          <>
            <div>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, margin: "0 0 4px", color: "#2C2C2A" }}>
                Ta soirée chez Kay Zouzou
              </h2>
              <p style={{ margin: 0, fontSize: 14, color: "#8A8377" }}>Donne ta note et dis-nous ce qui t&apos;a plu.</p>
            </div>

            <div style={{ display: "flex", gap: 6 }}>
              {[1, 2, 3, 4, 5].map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-label={`${v} étoile${v > 1 ? "s" : ""}`}
                  onClick={() => { setNote(v); setErreur(false); }}
                  onMouseEnter={() => setHover(v)}
                  onMouseLeave={() => setHover(0)}
                  style={{ background: "none", border: "none", padding: 4, cursor: "pointer" }}
                >
                  <span style={{ fontSize: 34, lineHeight: 1, color: v <= displayed ? "#D85A30" : "#F0997B" }}>★</span>
                </button>
              ))}
            </div>
            <p style={{ fontSize: 13, color: "#888780", minHeight: 18, margin: 0 }}>
              {displayed ? LABELS[displayed] : "Touche une étoile pour noter"}
            </p>
            {erreur && <p style={{ fontSize: 13, color: "#993C1D", margin: 0 }}>Choisis une note avant d&apos;envoyer.</p>}

            <label style={{ fontSize: 13, color: "#5F5E5A" }}>Un petit mot à nous laisser ?</label>
            <textarea
              rows={3}
              placeholder="Le mojito était top, l'ambiance parfaite..."
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              style={{
                width: "100%",
                resize: "vertical",
                padding: 10,
                borderRadius: 8,
                border: "1px solid #D3D1C7",
                fontFamily: "'Work Sans', sans-serif",
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%",
                padding: 12,
                border: "none",
                borderRadius: 8,
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
  );
}
