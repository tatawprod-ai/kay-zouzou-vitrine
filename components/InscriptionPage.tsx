import Link from "next/link";
import type { Evenement } from "@/lib/types";
import InscriptionForm from "@/components/InscriptionForm";

// Mise en page commune de /inscription et /inscription/[slug] (pages publiques,
// exceptions dans proxy.ts). Aucune image de public/ ici (derrière le code VIP) :
// les flyers viennent de Supabase Storage.

export default function InscriptionPage({ children }: { children: React.ReactNode }) {
  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <div style={eyebrowStyle}>PRÉINSCRIPTION</div>
        <h1 style={titleStyle}>Kay Zouzou</h1>
        <p style={subtitleStyle}>
          Réserve ta place à l&apos;un de nos événements. On revient vers toi pour confirmer ton inscription.
        </p>

        {children}

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

/** Formulaire, ou message si aucun événement n'est ouvert. */
export function InscriptionContenu({
  evenements,
  preselection,
}: {
  evenements: Evenement[];
  preselection: string;
}) {
  if (evenements.length === 0) {
    return (
      <p style={{ ...subtitleStyle, textAlign: "center", marginTop: 32 }}>
        Aucun événement n&apos;est ouvert aux inscriptions pour le moment. Reviens bientôt !
      </p>
    );
  }
  return <InscriptionForm evenements={evenements} preselection={preselection} />;
}

/** Lien inconnu ou événement fermé : message clair et retour vers /inscription. */
export function MessageLien({ texte }: { texte: string }) {
  return (
    <div style={messageStyle} role="status">
      <p style={{ fontSize: 15, lineHeight: 1.6, color: "#D9D0C3", margin: "0 0 20px" }}>{texte}</p>
      <Link href="/inscription" style={boutonStyle}>
        Voir les événements ouverts
      </Link>
    </div>
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
const messageStyle: React.CSSProperties = {
  background: "#2A231D",
  border: "1px solid rgba(184,147,90,0.35)",
  borderRadius: 10,
  padding: "32px 24px",
  textAlign: "center",
};
const boutonStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "12px 22px",
  borderRadius: 8,
  background: "#D85A30",
  color: "#FBF6EF",
  fontWeight: 500,
  fontSize: 15,
  textDecoration: "none",
};
