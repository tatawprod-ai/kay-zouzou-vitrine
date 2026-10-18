// Aperçu des liens partagés (WhatsApp, Instagram, Facebook) pour /inscription/<slug>.

export const SITE_URL = "https://kay-zouzou-vitrine.vercel.app";

// WhatsApp / Facebook n'affichent pas les SVG : seuls PNG, JPG et WebP sont annoncés.
const FORMAT_IMAGE_RE = /\.(png|jpe?g|webp)$/i;

/** Adresse complète (https://…) du flyer à annoncer en og:image, ou null si format non affichable. */
export function imageApercu(flyerUrl: string | null): string | null {
  if (!flyerUrl) return null;
  let url: URL;
  try {
    url = new URL(flyerUrl);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  return FORMAT_IMAGE_RE.test(url.pathname) ? url.toString() : null;
}

/** "jeudi 30 octobre 2026" à partir de "2026-10-30" (sans décalage de fuseau). */
export function dateLongue(date: string | null): string | null {
  if (!date) return null;
  const [a, m, j] = date.split("-").map(Number);
  if (!a || !m || !j) return null;
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(Date.UTC(a, m - 1, j)));
}

/** "jeudi 30 octobre 2026 · Kay Zouzou Home Bar — Préinscris-toi …" */
export function descriptionApercu(date: string | null, lieu: string | null): string {
  const infos = [dateLongue(date) ?? "Date à venir", lieu].filter(Boolean).join(" · ");
  return `${infos} — Préinscris-toi, on revient vers toi pour confirmer ta place.`;
}
