import type { Metadata } from "next";
import { supabase } from "@/lib/supabaseClient";
import type { Evenement } from "@/lib/types";
import MiseEnPageInscription, { InscriptionContenu } from "@/components/InscriptionPage";

// Page publique (exception dans proxy.ts) : accessible sans code VIP.
// Mise en page commune avec /inscription/[slug] : components/InscriptionPage.tsx.

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
    <MiseEnPageInscription>
      <InscriptionContenu evenements={liste} preselection={preselection} />
    </MiseEnPageInscription>
  );
}
