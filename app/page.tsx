import { supabase } from "@/lib/supabaseClient";
import { styles } from "@/lib/styles";
import Link from "next/link";

export const revalidate = 60; // rafraîchit le menu toutes les 60s

export default async function MenuPage() {
  // ⚠️ À adapter : remplace "cocktails" par le vrai nom de ta table,
  // et les colonnes (nom / description / prix / actif) par les tiennes.
  const { data: cocktails } = await supabase
    .from("cocktails")
    .select("*")
    .eq("actif", true)
    .order("nom");

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

        <h1 style={styles.h1}>Kay Zouzou</h1>
        <p style={styles.subtitle}>Le menu du moment 🍹</p>

        {!cocktails || cocktails.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888780", fontSize: 14 }}>
            Le menu arrive bientôt, reviens faire un tour !
          </p>
        ) : (
          cocktails.map((c) => (
            <div key={c.id} style={styles.card}>
              <p style={styles.itemName}>{c.nom}</p>
              {c.description && <p style={styles.itemDesc}>{c.description}</p>}
              <p style={styles.itemPrice}>{c.prix?.toFixed(2)} €</p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
