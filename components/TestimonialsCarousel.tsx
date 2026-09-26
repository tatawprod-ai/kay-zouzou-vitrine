"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Avis } from "@/lib/types";

const AUTO_DELAY_MS = 6000;

function starsFor(note: number) {
  return "★".repeat(note) + "☆".repeat(5 - note);
}

export default function TestimonialsCarousel() {
  const [avis, setAvis] = useState<Avis[]>([]);
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    supabase
      .from("avis_clients")
      .select("note, commentaire, created_at")
      .eq("valide", true)
      .not("commentaire", "is", null)
      .order("created_at", { ascending: false })
      .limit(12)
      .then(({ data }) => setAvis((data as Avis[]) || []));
  }, []);

  const total = avis.length;
  const average = total > 0 ? (avis.reduce((s, a) => s + a.note, 0) / total).toFixed(1) : null;

  function startTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    if (total <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, AUTO_DELAY_MS);
  }

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  function goTo(i: number) {
    setIndex(i);
    startTimer();
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.changedTouches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    const start = touchStartX.current;
    if (start === null) return;
    const delta = e.changedTouches[0].clientX - start;
    if (total === 0) return;
    if (delta < -40) goTo((index + 1) % total);
    else if (delta > 40) goTo((index - 1 + total) % total);
  }

  if (total === 0) return null;
  const current = avis[index];

  return (
    <div id="avis" style={{ background: "#211C18", padding: "96px 32px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#A99B7F", letterSpacing: 0.5 }}>
          Note moyenne — {average}/5 sur {total} avis
        </div>

        <div
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          style={{
            marginTop: 40,
            background: "#2E2820",
            borderRadius: 10,
            padding: "40px 32px",
            minHeight: 160,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            touchAction: "pan-y",
          }}
        >
          <div style={{ color: "#B8935A", fontSize: 15, letterSpacing: 2 }}>{starsFor(current.note)}</div>
          <p style={{ fontFamily: "'Fraunces', serif", fontSize: 20, lineHeight: 1.6, color: "#E8DFCE", margin: 0, fontWeight: 400 }}>
            {current.commentaire}
          </p>
        </div>

        <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 8 }}>
          {avis.map((_, i) => (
            <button
              key={i}
              aria-label={`Avis ${i + 1}`}
              onClick={() => goTo(i)}
              style={{
                width: 8,
                height: 8,
                padding: 0,
                borderRadius: 100,
                border: "none",
                cursor: "pointer",
                background: i === index ? "#D85A30" : "rgba(184,147,90,0.4)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
