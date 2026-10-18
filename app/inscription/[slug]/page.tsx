import { cache } from "react";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabaseClient";
import type { Evenement } from "@/lib/types";
import { slugValide } from "@/lib/slug";
import { SITE_URL, descriptionApercu, imageApercu } from "@/lib/apercu";
import MiseEnPageInscription, { InscriptionContenu, MessageLien } from "@/components/InscriptionPage";

// Lien d'inscription lisible par événement (/inscription/halloween), partagé sur
// WhatsApp / Instagram. Page publique : exception stricte dans proxy.ts (lib/slug.ts).
// Lien inconnu ou événement fermé : message clair, jamais d'erreur technique.

type Props = { params: Promise<{ slug: string }> };

/** Partagé entre la page et generateMetadata (une seule requête par rendu). */
const evenementParSlug = cache(async (slug: string): Promise<Evenement | null> => {
  if (!slugValide(slug)) return null;
  const { data } = await supabase.from("evenements").select("*").eq("slug", slug).maybeSingle<Evenement>();
  return data ?? null;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const evenement = await evenementParSlug(slug);
  if (!evenement || !evenement.actif) {
    return {
      title: "Préinscription — Kay Zouzou",
      robots: { index: false, follow: false },
    };
  }
  // Aperçu WhatsApp / Instagram / Facebook : adresses complètes, image seulement
  // si le flyer est en PNG, JPG ou WebP (lib/apercu.ts).
  const titre = `Préinscription — ${evenement.titre}`;
  const description = descriptionApercu(evenement.date_evenement, evenement.lieu);
  const url = `${SITE_URL}/inscription/${evenement.slug}`;
  const image = imageApercu(evenement.flyer_url);
  return {
    title: `${titre} | Kay Zouzou`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: "Kay Zouzou",
      title: titre,
      description,
      url,
      ...(image ? { images: [{ url: image, alt: evenement.titre }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: titre,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function InscriptionSlugPage({ params }: Props) {
  const { slug } = await params;
  const evenement = await evenementParSlug(slug);

  if (!evenement) {
    return (
      <MiseEnPageInscription>
        <MessageLien texte="Ce lien d'inscription n'existe pas (ou plus)." />
      </MiseEnPageInscription>
    );
  }

  if (!evenement.actif) {
    return (
      <MiseEnPageInscription>
        <MessageLien texte={`Les inscriptions pour « ${evenement.titre} » sont fermées.`} />
      </MiseEnPageInscription>
    );
  }

  const { data: evenements } = await supabase
    .from("evenements")
    .select("*")
    .eq("actif", true)
    .order("position")
    .returns<Evenement[]>();

  return (
    <MiseEnPageInscription>
      <InscriptionContenu evenements={evenements ?? []} preselection={evenement.id} />
    </MiseEnPageInscription>
  );
}
