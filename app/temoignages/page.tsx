import { supabase } from "@/lib/supabaseClient";
import { styles } from "@/lib/styles";
import Link from "next/link";

export const revalidate = 60;

function renderStars(note: number) {
  return "★".repeat(note) + "☆".repeat(5 - note);
}

export default async function TemoignagesPage() {
  const { data: avis } = await supabase
    .from("avis_clients")
    .select("note, commentaire, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  const total = avis?.length ?? 0;
  const moyenne =
    total > 0
      ? (avis!.reduce((sum, a) => sum + a.note, 0) / total).toFixed(1)
      : null;

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <nav style={styles.nav}>
          <Link href="/" style={styles.navLink}>
            Menu
          </Link>
          <Link href="/avis" style={styles.navLink}>
            Laisser un avis
          </Link>
          <Link href="/temoignages" style={styles.navLink}>
            Avis clients
          </Link>
        </nav>

        <h1 style={styles.h1}>Ce qu'on en dit</h1>
        {moyenne && (
          <p style={styles.subtitle}>
            <span style={styles.stars}>{renderStars(Math.round(Number(moyenne)))}</span>
            {"  "}
            {moyenne}/5 sur {total} avis
          </p>
        )}

        {total === 0 ? (
          <p style={{ textAlign: "center", color: "#888780", fontSize: 14 }}>
            Pas encore d'avis, sois le·la premier·ère !
          </p>
        ) : (
          avis!
            .filter((a) => a.commentaire)
            .map((a, i) => (
              <div key={i} style={styles.card}>
                <p style={styles.stars}>{renderStars(a.note)}</p>
                <p style={{ ...styles.itemDesc, marginTop: 8 }}>
                  {a.commentaire}
                </p>
              </div>
            ))
        )}
      </div>
    </main>
  );
}
