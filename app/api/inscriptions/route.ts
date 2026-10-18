import { createHmac } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabaseAdmin";
import { validerInscription } from "@/lib/inscriptionRules";

// Route publique (exception dans proxy.ts) : seule voie d'écriture dans
// `inscriptions`, fermée à la clé publique. Jamais de détail technique dans les réponses.

const TAILLE_MAX_OCTETS = 10_000;
const LIMITE_TENTATIVES = 8;
const FENETRE_MS = 10 * 60 * 1000;
const PURGE_MS = 24 * 60 * 60 * 1000;
const ERREUR_GENERIQUE = "Une erreur est survenue, réessaie plus tard ou écris-nous sur Instagram.";

function reponse(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status });
}

/** Sur Vercel, x-forwarded-for est renseigné par la plateforme (premier élément = IP du client). */
function ipClient(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0].trim() || request.headers.get("x-real-ip") || "inconnue";
}

export async function POST(request: NextRequest) {
  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    console.error("[inscriptions] configuration serveur incomplète");
    return reponse(500, { ok: false, error: ERREUR_GENERIQUE });
  }

  // 1. Limite par IP (toutes les tentatives comptent, même refusées).
  const ipHash = createHmac("sha256", process.env.SUPABASE_SERVICE_ROLE_KEY!).update(ipClient(request)).digest("hex");
  const maintenant = Date.now();
  const { error: tentativeError } = await supabase.from("inscriptions_tentatives").insert({ ip_hash: ipHash });
  const { count, error: countError } = await supabase
    .from("inscriptions_tentatives")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", new Date(maintenant - FENETRE_MS).toISOString());
  if (tentativeError || countError) {
    console.error("[inscriptions] limite IP :", tentativeError?.code ?? countError?.code);
    return reponse(500, { ok: false, error: ERREUR_GENERIQUE });
  }
  // Purge opportuniste des tentatives de plus de 24 h (sans bloquer la réponse en cas d'échec).
  await supabase
    .from("inscriptions_tentatives")
    .delete()
    .lt("created_at", new Date(maintenant - PURGE_MS).toISOString());

  if ((count ?? 0) > LIMITE_TENTATIVES) {
    return reponse(429, { ok: false, error: "Trop de tentatives, réessaie dans quelques minutes." });
  }

  // 2. Lecture du corps : JSON, taille bornée.
  const brut = await request.text();
  if (brut.length > TAILLE_MAX_OCTETS) {
    return reponse(413, { ok: false, error: "Le formulaire envoyé est trop volumineux." });
  }
  let body: Record<string, unknown>;
  try {
    const parsed = JSON.parse(brut);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    body = parsed;
  } catch {
    return reponse(400, { ok: false, error: "Le formulaire envoyé n'est pas valide." });
  }

  // 3. Champ piège : un robot l'a rempli → on fait comme si tout allait bien, sans rien enregistrer.
  if (typeof body.site_web === "string" && body.site_web.trim() !== "") {
    return reponse(200, { ok: true });
  }

  // 4. Validation des champs.
  const resultat = validerInscription(body);
  if (!resultat.ok) {
    return reponse(400, { ok: false, champ: resultat.champ, error: resultat.error });
  }

  // 5. L'événement doit exister et être actif.
  const { data: evenement, error: evenementError } = await supabase
    .from("evenements")
    .select("id")
    .eq("id", resultat.data.evenement_id)
    .eq("actif", true)
    .maybeSingle();
  if (evenementError) {
    console.error("[inscriptions] lecture événement :", evenementError.code);
    return reponse(500, { ok: false, error: ERREUR_GENERIQUE });
  }
  if (!evenement) {
    return reponse(400, {
      ok: false,
      champ: "evenement_id",
      error: "Cet événement n'est plus ouvert aux inscriptions.",
    });
  }

  // 6. Enregistrement : statut toujours forcé à en_attente.
  const { error: insertError } = await supabase
    .from("inscriptions")
    .insert({ ...resultat.data, consentement: true, statut: "en_attente" });
  if (insertError) {
    console.error("[inscriptions] enregistrement :", insertError.code);
    return reponse(500, { ok: false, error: ERREUR_GENERIQUE });
  }

  return reponse(200, { ok: true });
}
