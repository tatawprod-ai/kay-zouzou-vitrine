import Link from "next/link";

export default function MentionsLegalesPage() {
  return (
    <main style={{ background: "#211C18", minHeight: "100dvh", padding: "56px 32px 100px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Link href="/" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#A99B7F" }}>
          ← Retour
        </Link>

        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 36, color: "#E8DFCE", margin: "32px 0 40px" }}>
          Mentions légales
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: 28, fontSize: 14, lineHeight: 1.7, color: "#B8AFA1" }}>
          <section>
            <h2 style={h2}>Éditeur du site</h2>
            <p style={{ margin: 0 }}>
              Ce site est édité à titre non professionnel, sans activité commerciale déclarée à ce jour.
              Conformément à la loi n°2004-575 du 21 juin 2004 (LCEN), l&apos;éditeur non professionnel peut
              conserver son anonymat vis-à-vis du public ; son identité complète est communiquée à l&apos;hébergeur.
            </p>
            <p style={{ margin: "12px 0 0" }}>Contact : tatawprod@gmail.com</p>
          </section>

          <section>
            <h2 style={h2}>Directeur de la publication</h2>
            <p style={{ margin: 0 }}>Tatiana Segarel</p>
          </section>

          <section>
            <h2 style={h2}>Hébergement</h2>
            <p style={{ margin: 0 }}>
              Vercel Inc.
              <br />
              340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis
            </p>
          </section>

          <section>
            <h2 style={h2}>Propriété intellectuelle</h2>
            <p style={{ margin: 0 }}>
              L&apos;ensemble des contenus de ce site (textes, photographies, logo, recettes) est la propriété
              de l&apos;éditeur, sauf mention contraire. Toute reproduction sans autorisation est interdite.
            </p>
          </section>

          <section>
            <h2 style={h2}>Données personnelles</h2>
            <p style={{ margin: 0 }}>
              Ce site collecte les avis clients (note et commentaire) via un formulaire, stockés sur Supabase.
              Aucune donnée n&apos;est cédée à des tiers. Ces données sont conservées 3 ans à compter de leur
              dépôt, durée au-delà de laquelle elles sont supprimées ou anonymisées. Pour exercer un droit
              d&apos;accès, de rectification ou de suppression, contacter : tatawprod@gmail.com.
            </p>
          </section>

          <section style={{ padding: 20, border: "1px solid rgba(184,147,90,0.4)", borderRadius: 8 }}>
            <h2 style={h2}>Consommation d&apos;alcool</h2>
            <p style={{ margin: 0, color: "#E8DFCE" }}>
              L&apos;abus d&apos;alcool est dangereux pour la santé, à consommer avec modération. La vente et
              la consommation d&apos;alcool sont interdites aux mineurs de moins de 18 ans.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

const h2: React.CSSProperties = { fontFamily: "'Fraunces', serif", fontSize: 18, color: "#E8DFCE", margin: "0 0 8px" };
