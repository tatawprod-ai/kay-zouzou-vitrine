"use client";

import { useState } from "react";
import type { Evenement } from "@/lib/types";
import { LIMITES } from "@/lib/inscriptionRules";

// Formulaire de préinscription : envoie uniquement à /api/inscriptions (jamais
// d'écriture Supabase depuis le navigateur). La validation du serveur fait foi.

type Champ = "evenement_id" | "prenom" | "nom" | "email" | "telephone" | "nb_personnes" | "message" | "consentement";

const ERREUR_RESEAU = "Impossible d'envoyer le formulaire. Vérifie ta connexion et réessaie.";

function formatDate(date: string | null): string {
  if (!date) return "Date à venir";
  const [annee, mois, jour] = date.split("-");
  return `${jour}/${mois}/${annee}`;
}

export default function InscriptionForm({
  evenements,
  preselection,
}: {
  evenements: Evenement[];
  preselection: string;
}) {
  const [evenementId, setEvenementId] = useState(preselection);
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [nbPersonnes, setNbPersonnes] = useState(1);
  const [message, setMessage] = useState("");
  const [consentement, setConsentement] = useState(false);
  const [siteWeb, setSiteWeb] = useState("");

  const [loading, setLoading] = useState(false);
  const [erreurChamp, setErreurChamp] = useState<{ champ: Champ; message: string } | null>(null);
  const [erreurGenerale, setErreurGenerale] = useState("");
  const [envoye, setEnvoye] = useState<{ prenom: string; titre: string } | null>(null);

  const evenement = evenements.find((e) => e.id === evenementId);

  function effacerErreur(champ: Champ) {
    if (erreurChamp?.champ === champ) setErreurChamp(null);
    setErreurGenerale("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setErreurChamp(null);
    setErreurGenerale("");
    try {
      const res = await fetch("/api/inscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          evenement_id: evenementId,
          prenom,
          nom,
          email,
          telephone,
          nb_personnes: nbPersonnes,
          message,
          consentement,
          site_web: siteWeb,
        }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.ok) {
        setEnvoye({ prenom: prenom.trim(), titre: evenement?.titre ?? "" });
        return;
      }
      const texte = typeof json?.error === "string" ? json.error : ERREUR_RESEAU;
      if (typeof json?.champ === "string") {
        setErreurChamp({ champ: json.champ as Champ, message: texte });
        document.getElementById(`inscription-${json.champ}`)?.focus();
      } else {
        setErreurGenerale(texte);
      }
    } catch {
      setErreurGenerale(ERREUR_RESEAU);
    } finally {
      setLoading(false);
    }
  }

  if (envoye) {
    return (
      <div style={{ ...cardStyle, textAlign: "center", padding: "40px 24px" }} role="status">
        <p style={{ fontFamily: "'Fraunces', serif", fontSize: 24, color: "#E8DFCE", margin: "0 0 12px" }}>
          Merci {envoye.prenom} ! 🌴
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: "#D9D0C3", margin: 0 }}>
          Ta préinscription{envoye.titre ? <> à <strong style={{ color: "#E8DFCE" }}>{envoye.titre}</strong></> : null} est
          bien reçue. On revient vers toi pour la confirmer.
        </p>
      </div>
    );
  }

  const erreur = (champ: Champ) =>
    erreurChamp?.champ === champ ? (
      <p id={`inscription-${champ}-erreur`} style={erreurStyle} role="alert">
        {erreurChamp.message}
      </p>
    ) : null;
  const aria = (champ: Champ) =>
    erreurChamp?.champ === champ
      ? { "aria-invalid": true as const, "aria-describedby": `inscription-${champ}-erreur` }
      : {};
  const bordure = (champ: Champ): React.CSSProperties =>
    erreurChamp?.champ === champ ? { borderColor: "#C9694A" } : {};

  return (
    <form onSubmit={handleSubmit} noValidate style={cardStyle}>
      {evenement && (
        <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 24 }}>
          <div style={{ width: 72, aspectRatio: "3/4", borderRadius: 4, overflow: "hidden", background: "#2E2820", flex: "0 0 auto" }}>
            {evenement.flyer_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={evenement.flyer_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            )}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#D85A30" }}>
              {formatDate(evenement.date_evenement)}
            </div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 19, color: "#E8DFCE", marginTop: 2 }}>{evenement.titre}</div>
            {evenement.lieu && <div style={{ fontSize: 13, color: "#8A8377", marginTop: 2 }}>{evenement.lieu}</div>}
          </div>
        </div>
      )}

      <div style={fieldStyle}>
        <label htmlFor="inscription-evenement_id" style={labelStyle}>Événement</label>
        <select
          id="inscription-evenement_id"
          value={evenementId}
          onChange={(e) => { setEvenementId(e.target.value); effacerErreur("evenement_id"); }}
          style={{ ...inputStyle, ...bordure("evenement_id") }}
          {...aria("evenement_id")}
        >
          <option value="">Choisis un événement</option>
          {evenements.map((e) => (
            <option key={e.id} value={e.id}>
              {e.titre} — {formatDate(e.date_evenement)}
            </option>
          ))}
        </select>
        {erreur("evenement_id")}
      </div>

      <div style={rowStyle}>
        <div style={fieldStyle}>
          <label htmlFor="inscription-prenom" style={labelStyle}>Prénom</label>
          <input
            id="inscription-prenom"
            value={prenom}
            onChange={(e) => { setPrenom(e.target.value); effacerErreur("prenom"); }}
            maxLength={LIMITES.prenom}
            autoComplete="given-name"
            style={{ ...inputStyle, ...bordure("prenom") }}
            {...aria("prenom")}
          />
          {erreur("prenom")}
        </div>
        <div style={fieldStyle}>
          <label htmlFor="inscription-nom" style={labelStyle}>Nom</label>
          <input
            id="inscription-nom"
            value={nom}
            onChange={(e) => { setNom(e.target.value); effacerErreur("nom"); }}
            maxLength={LIMITES.nom}
            autoComplete="family-name"
            style={{ ...inputStyle, ...bordure("nom") }}
            {...aria("nom")}
          />
          {erreur("nom")}
        </div>
      </div>

      <div style={fieldStyle}>
        <label htmlFor="inscription-email" style={labelStyle}>Email</label>
        <input
          id="inscription-email"
          type="email"
          inputMode="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); effacerErreur("email"); }}
          maxLength={LIMITES.email}
          autoComplete="email"
          style={{ ...inputStyle, ...bordure("email") }}
          {...aria("email")}
        />
        {erreur("email")}
      </div>

      <div style={rowStyle}>
        <div style={fieldStyle}>
          <label htmlFor="inscription-telephone" style={labelStyle}>Téléphone</label>
          <input
            id="inscription-telephone"
            type="tel"
            inputMode="tel"
            required
            value={telephone}
            onChange={(e) => { setTelephone(e.target.value); effacerErreur("telephone"); }}
            maxLength={LIMITES.telephone}
            autoComplete="tel"
            style={{ ...inputStyle, ...bordure("telephone") }}
            {...aria("telephone")}
            aria-describedby={
              erreurChamp?.champ === "telephone"
                ? "inscription-telephone-aide inscription-telephone-erreur"
                : "inscription-telephone-aide"
            }
          />
          <p id="inscription-telephone-aide" style={aideStyle}>
            Pour t&apos;envoyer ton code d&apos;accès une fois ton inscription confirmée.
          </p>
          {erreur("telephone")}
        </div>
        <div style={fieldStyle}>
          <label htmlFor="inscription-nb_personnes" style={labelStyle}>Nombre de personnes</label>
          <select
            id="inscription-nb_personnes"
            value={nbPersonnes}
            onChange={(e) => { setNbPersonnes(Number(e.target.value)); effacerErreur("nb_personnes"); }}
            style={{ ...inputStyle, ...bordure("nb_personnes") }}
            {...aria("nb_personnes")}
          >
            {Array.from({ length: LIMITES.nbPersonnesMax - LIMITES.nbPersonnesMin + 1 }, (_, i) => i + LIMITES.nbPersonnesMin).map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          {erreur("nb_personnes")}
        </div>
      </div>

      <div style={fieldStyle}>
        <label htmlFor="inscription-message" style={labelStyle}>
          Message <span style={optionnelStyle}>(optionnel)</span>
        </label>
        <textarea
          id="inscription-message"
          value={message}
          onChange={(e) => { setMessage(e.target.value); effacerErreur("message"); }}
          maxLength={LIMITES.message}
          rows={3}
          placeholder="Une allergie, une question, une occasion à fêter…"
          style={{ ...inputStyle, resize: "vertical", ...bordure("message") }}
          {...aria("message")}
        />
        {erreur("message")}
      </div>

      {/* Champ piège : invisible pour les humains, rempli par les robots. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor="inscription-site_web">Site web</label>
        <input
          id="inscription-site_web"
          name="site_web"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={siteWeb}
          onChange={(e) => setSiteWeb(e.target.value)}
        />
      </div>

      <div style={fieldStyle}>
        <label style={{ display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}>
          <input
            id="inscription-consentement"
            type="checkbox"
            checked={consentement}
            onChange={(e) => { setConsentement(e.target.checked); effacerErreur("consentement"); }}
            style={{ width: 18, height: 18, marginTop: 2, accentColor: "#D85A30", flex: "0 0 auto" }}
            {...aria("consentement")}
          />
          <span style={{ fontSize: 13, lineHeight: 1.55, color: "#D9D0C3" }}>
            J&apos;accepte que Kay Zouzou utilise ces informations uniquement pour gérer mon inscription et me
            recontacter à ce sujet. Elles ne sont jamais transmises à des tiers et sont conservées au maximum 3 mois
            après l&apos;événement.
          </span>
        </label>
        {erreur("consentement")}
      </div>

      {erreurGenerale && (
        <p style={{ ...erreurStyle, marginTop: 0, marginBottom: 12 }} role="alert">
          {erreurGenerale}
        </p>
      )}

      <button type="submit" disabled={loading} style={{ ...buttonStyle, opacity: loading ? 0.6 : 1, cursor: loading ? "wait" : "pointer" }}>
        {loading ? "Envoi en cours…" : "S'inscrire"}
      </button>
    </form>
  );
}

const cardStyle: React.CSSProperties = {
  position: "relative",
  background: "#2A231D",
  border: "1px solid rgba(184,147,90,0.35)",
  borderRadius: 10,
  padding: "28px 20px",
};
const rowStyle: React.CSSProperties = { display: "flex", columnGap: 14, flexWrap: "wrap" };
const fieldStyle: React.CSSProperties = { flex: "1 1 200px", minWidth: 0, marginBottom: 18 };
const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 11,
  letterSpacing: 1,
  textTransform: "uppercase",
  color: "#B8935A",
  marginBottom: 6,
};
const optionnelStyle: React.CSSProperties = { textTransform: "none", letterSpacing: 0, color: "#8A8377" };
const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  borderRadius: 8,
  // Propriétés séparées (pas le raccourci `border`) : borderColor est surchargé en cas d'erreur.
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "rgba(184,147,90,0.4)",
  background: "#211C18",
  color: "#E8DFCE",
  fontFamily: "'Work Sans', sans-serif",
  fontSize: 16,
};
const aideStyle: React.CSSProperties = { fontSize: 12, lineHeight: 1.45, color: "#8A8377", margin: "6px 0 0" };
const erreurStyle: React.CSSProperties = { fontSize: 13, color: "#E08A6A", margin: "6px 0 0" };
const buttonStyle: React.CSSProperties = {
  width: "100%",
  marginTop: 4,
  padding: 14,
  border: "none",
  borderRadius: 8,
  background: "#D85A30",
  color: "#FBF6EF",
  fontWeight: 500,
  fontSize: 15,
};
