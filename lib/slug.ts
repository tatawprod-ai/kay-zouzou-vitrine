// Nom court d'un événement (/inscription/<slug>). Même règle que la contrainte
// evenements_slug_format (supabase/migrations/0017_evenements_slug.sql) :
// minuscules, chiffres et tirets simples (ni au début ni à la fin), 40 caractères max.

export const SLUG_LONGUEUR_MAX = 40;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugValide(slug: string): boolean {
  return slug.length >= 1 && slug.length <= SLUG_LONGUEUR_MAX && SLUG_RE.test(slug);
}

/**
 * Pour le proxy : renvoie le slug si le chemin est exactement /inscription/<slug valide>
 * (un seul segment, aucun caractère encodé), sinon null.
 */
export function slugDepuisChemin(pathname: string): string | null {
  const m = /^\/inscription\/([^/]+)$/.exec(pathname);
  return m && slugValide(m[1]) ? m[1] : null;
}
