// Règles du formulaire de préinscription, partagées entre le formulaire (limites
// affichées) et la route /api/inscriptions (qui seule fait foi). Aucun secret ici.

export const LIMITES = {
  prenom: 60,
  nom: 60,
  email: 254,
  telephone: 30,
  telephoneChiffresMin: 9,
  telephoneChiffresMax: 15,
  message: 1000,
  nbPersonnesMin: 1,
  nbPersonnesMax: 10,
} as const;

export type InscriptionValide = {
  evenement_id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  nb_personnes: number;
  message: string | null;
};

export type ResultatValidation =
  | { ok: true; data: InscriptionValide }
  | { ok: false; champ: string; error: string };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TELEPHONE_RE = /^[0-9 +().-]+$/;

function texte(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

/** Ne lit que les champs prévus : tout autre champ envoyé (ex. statut) est ignoré. */
export function validerInscription(body: Record<string, unknown>): ResultatValidation {
  const evenement_id = texte(body.evenement_id);
  if (!UUID_RE.test(evenement_id)) {
    return { ok: false, champ: "evenement_id", error: "Merci de choisir un événement." };
  }

  const prenom = texte(body.prenom);
  if (!prenom) return { ok: false, champ: "prenom", error: "Merci d'indiquer ton prénom." };
  if (prenom.length > LIMITES.prenom) {
    return { ok: false, champ: "prenom", error: `Le prénom ne doit pas dépasser ${LIMITES.prenom} caractères.` };
  }

  const nom = texte(body.nom);
  if (!nom) return { ok: false, champ: "nom", error: "Merci d'indiquer ton nom." };
  if (nom.length > LIMITES.nom) {
    return { ok: false, champ: "nom", error: `Le nom ne doit pas dépasser ${LIMITES.nom} caractères.` };
  }

  const email = texte(body.email).toLowerCase();
  if (!email || email.length > LIMITES.email || !EMAIL_RE.test(email)) {
    return { ok: false, champ: "email", error: "Merci d'indiquer un email valide." };
  }

  // Obligatoire : sert à envoyer le code VIP après confirmation. 9 à 15 chiffres
  // (séparateurs ignorés) pour accepter aussi les numéros internationaux.
  const telephone = texte(body.telephone);
  const nbChiffres = telephone.replace(/\D/g, "").length;
  if (
    !telephone ||
    telephone.length > LIMITES.telephone ||
    !TELEPHONE_RE.test(telephone) ||
    nbChiffres < LIMITES.telephoneChiffresMin ||
    nbChiffres > LIMITES.telephoneChiffresMax
  ) {
    return { ok: false, champ: "telephone", error: "Merci d'indiquer un numéro de téléphone valide." };
  }

  const nbBrut = body.nb_personnes;
  const nb_personnes =
    typeof nbBrut === "number" ? nbBrut : typeof nbBrut === "string" && nbBrut.trim() !== "" ? Number(nbBrut) : NaN;
  if (!Number.isInteger(nb_personnes) || nb_personnes < LIMITES.nbPersonnesMin || nb_personnes > LIMITES.nbPersonnesMax) {
    return {
      ok: false,
      champ: "nb_personnes",
      error: `Le nombre de personnes doit être compris entre ${LIMITES.nbPersonnesMin} et ${LIMITES.nbPersonnesMax}.`,
    };
  }

  const messageBrut = texte(body.message);
  if (messageBrut.length > LIMITES.message) {
    return { ok: false, champ: "message", error: `Le message ne doit pas dépasser ${LIMITES.message} caractères.` };
  }

  if (body.consentement !== true) {
    return { ok: false, champ: "consentement", error: "Merci de cocher la case de consentement pour t'inscrire." };
  }

  return {
    ok: true,
    data: {
      evenement_id,
      prenom,
      nom,
      email,
      telephone,
      nb_personnes,
      message: messageBrut || null,
    },
  };
}
