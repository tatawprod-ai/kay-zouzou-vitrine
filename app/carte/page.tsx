import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import type { Cocktail } from "@/lib/types";

export const revalidate = 60;

export default async function CartePage() {
  const { data } = await supabase
    .from("cocktails")
    .select("*")
    .eq("actif", true)
    .order("prix", { ascending: true })
    .returns<Cocktail[]>();

  const spiritueux = data?.filter((c) => c.categorie === "avec_alcool") ?? [];
  const sansAlcool = data?.filter((c) => c.categorie === "sans_alcool") ?? [];

  return (
    <main style={{ background: "#FFFFFF", minHeight: "100dvh", padding: "56px 32px 100px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <Link href="/#cocktails" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#6B6259" }}>
          ← Retour
        </Link>

        <div style={{ margin: "32px 0 56px" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", color: "#D85A30", fontSize: 13, letterSpacing: 0.5, marginBottom: 8 }}>
            La carte
          </div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 44, color: "#1A1A1A", margin: 0 }}>Tous nos cocktails</h1>
        </div>

        <Section title="Spiritueux" items={spiritueux} />
        <Section title="Sans alcool" items={sansAlcool} />

        <div style={{ marginTop: 40, padding: "20px 0", borderTop: "1px solid rgba(184,147,90,0.25)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16 }}>
          <div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 19, color: "#1A1A1A" }}>Frites maison</div>
            <div style={{ fontSize: 13, color: "#6B6259", marginTop: 3 }}>Frites · mayonnaise</div>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: "#000" }}>Offertes</div>
        </div>

        <div style={{ marginTop: 56, paddingTop: 20, borderTop: "1px solid rgba(184,147,90,0.2)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#6B6259", margin: 0 }}>
            L&apos;abus d&apos;alcool est dangereux pour la santé, à consommer avec modération.
          </p>
          <Link href="/mentions-legales" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#4A453E", borderBottom: "1px solid #4A453E" }}>
            Mentions légales
          </Link>
        </div>
      </div>
    </main>
  );
}

function Section({ title, items }: { title: string; items: Cocktail[] }) {
  if (items.length === 0) return null;
  return (
    <>
      <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, color: "#9C6B2E", margin: "0 0 20px" }}>{title}</h2>
      <div style={{ display: "flex", flexDirection: "column", marginBottom: 32 }}>
        {items.map((c) => (
          <div key={c.id} style={{ padding: "20px 0", borderBottom: "1px solid rgba(184,147,90,0.25)" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16 }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 19, color: "#1A1A1A" }}>{c.nom}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: "#000" }}>{c.prix.toFixed(0)} €</div>
            </div>
            {c.description && <div style={{ fontSize: 13, color: "#6B6259", marginTop: 3 }}>{c.description}</div>}
            {(c.parfums?.length > 0 || c.note_speciale) && (
              <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {c.note_speciale && <Chip label={c.note_speciale} />}
                {c.parfums?.map((p) => <Chip key={p} label={p} />)}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span style={{ display: "inline-flex", padding: "3px 10px", borderRadius: 100, border: "1px solid rgba(184,147,90,0.5)", fontSize: 11, color: "#9C6B2E" }}>
      {label}
    </span>
  );
}
