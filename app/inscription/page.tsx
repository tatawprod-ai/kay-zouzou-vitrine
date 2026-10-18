import type { Metadata } from "next";
import { supabase } from "@/lib/supabaseClient";
import type { Evenement } from "@/lib/types";
import InscriptionForm from "@/components/InscriptionForm";

// Page publique (exception dans proxy.ts) : accessible sans code VIP.
// Aucune image de public/ ici (derrière le code VIP) — les flyers viennent de Supabase Storage.

export const metadata: Metadata = {
  title: "Préinscription — Kay Zouzou",
  description: "Préinscris-toi à un événement Kay Zouzou.",
};

export default async function InscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { evenement } = await searchParams;
  const { data: evenements } = await supabase
    .from("evenements")
    .select("*")
    .eq("actif", true)
    .order("position")
    .returns<Evenement[]>();

  const liste = evenements ?? [];
  const demande = typeof evenement === "string" ? evenement : "";
  const preselection = liste.some((e) => e.id === demande) ? demande : "";

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <div style={eyebrowStyle}>PRÉINSCRIPTION</div>
        <h1 style={titleStyle}>Kay Zouzou</h1>
        <p style={subtitleStyle}>
          Réserve ta place à l&apos;un de nos événements. On revient vers toi pour confirmer ton inscription.
        </p>

        {liste.length === 0 ? (
          <p style={{ ...subtitleStyle, textAlign: "center", marginTop: 32 }}>
            Aucun événement n&apos;est ouvert aux inscriptions pour le moment. Reviens bientôt !
          </p>
        ) : (
          <InscriptionForm evenements={liste} preselection={preselection} />
        )}

        <p style={footerStyle}>
          <a href="https://www.instagram.com/kay_zouzou/" style={{ color: "#8A8377" }}>
            @kay_zouzou
          </a>
          {" · "}L&apos;abus d&apos;alcool est dangereux pour la santé, à consommer avec modération.
        </p>
      </div>
    </main>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100dvh",
  background: "#211C18",
  padding: "56px 16px 40px",
  fontFamily: "'Work Sans', sans-serif",
};
const eyebrowStyle: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  color: "#B8935A",
  fontSize: 12,
  letterSpacing: 1.5,
  textAlign: "center",
  marginBottom: 12,
};
const titleStyle: React.CSSProperties = {
  fontFamily: "'Fraunces', serif",
  fontSize: 34,
  color: "#E8DFCE",
  margin: "0 0 12px",
  textAlign: "center",
};
const subtitleStyle: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.6,
  color: "#A99B7F",
  margin: "0 auto 32px",
  maxWidth: 420,
  textAlign: "center",
};
const footerStyle: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 11,
  lineHeight: 1.6,
  color: "#6E6558",
  textAlign: "center",
  marginTop: 40,
};
