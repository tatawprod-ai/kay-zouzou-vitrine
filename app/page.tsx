import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import type { Cocktail, Evenement, AlbumPhoto } from "@/lib/types";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import AvisForm from "@/components/AvisForm";

export const revalidate = 60;

export default async function HomePage() {
  const [{ data: featured }, { data: allCocktails }, { data: evenements }, { data: photos }] =
    await Promise.all([
      supabase
        .from("cocktails")
        .select("*")
        .eq("actif", true)
        .eq("mis_en_avant", true)
        .order("prix", { ascending: true })
        .returns<Cocktail[]>(),
      supabase.from("cocktails").select("id", { count: "exact", head: false }).eq("actif", true),
      supabase
        .from("evenements")
        .select("*")
        .eq("actif", true)
        .order("position")
        .returns<Evenement[]>(),
      supabase
        .from("album_photos")
        .select("*")
        .order("position")
        .limit(8)
        .returns<AlbumPhoto[]>(),
    ]);

  const totalCocktails = allCocktails?.length ?? 0;

  return (
    <main>
      {/* NAV */}
      <div style={navWrapStyle}>
        <div style={navInnerStyle}>
          <a href="#hero" style={{ fontFamily: "'Fraunces', serif", fontSize: 20, color: "#E8DFCE" }}>
            Kay Zouzou
          </a>
          <div style={navLinksStyle} className="kz-navlinks">
            <a href="#cocktails" style={navLinkStyle}>Nos cocktails</a>
            <a href="#evenements" style={navLinkStyle}>Nos événements</a>
            <a href="#album" style={navLinkStyle}>Album</a>
            <a href="#avis" style={navLinkStyle}>Les avis</a>
          </div>
          <a href="#laisser-un-avis" style={ctaStyle}>Laisser un avis</a>
        </div>
      </div>

      {/* HERO */}
      <div id="hero" style={heroStyle}>
        <div style={heroOverlayStyle} />
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", color: "#D85A30", fontSize: 13 }}>
            Bar à cocktails artisanal
          </div>
          <h1 className="kz-hero-title" style={heroTitleStyle}>Kay Zouzou</h1>
          <p style={{ maxWidth: 480, margin: "0 auto", fontSize: 17, lineHeight: 1.6, color: "#D9D0C3" }}>
            Des cocktails maison pour vos soirées, mariages et événements privés — recettes originales, service sur mesure.
          </p>
          <div style={{ display: "flex", gap: 16, marginTop: 28, flexWrap: "wrap", justifyContent: "center" }}>
            <a href="#cocktails" style={ctaStyle}>Voir le menu</a>
            <a href="#evenements" style={{ ...ctaStyle, background: "transparent", border: "1px solid rgba(243,238,227,0.5)", color: "#F3EEE3" }}>
              Nos événements
            </a>
          </div>
        </div>
      </div>

      {/* COCKTAILS */}
      <div id="cocktails" style={{ background: "#FBF6EF", padding: "96px 32px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 48, gap: 24, flexWrap: "wrap" }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 36, color: "#2C2C2A", margin: 0 }}>Nos cocktails</h2>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#8A8377" }}>
              {totalCocktails} cocktails au menu
            </span>
          </div>

          {featured?.map((c) => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 20, padding: "22px 0", borderBottom: "1px solid rgba(184,147,90,0.3)" }}>
              {c.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.photo_url} alt={c.nom} style={{ width: 64, height: 64, borderRadius: 4, objectFit: "cover", flex: "0 0 auto" }} />
              ) : (
                <div style={{ width: 64, height: 64, borderRadius: 4, background: "#EFE7D8", flex: "0 0 auto" }} />
              )}
              <div style={{ flexGrow: 1 }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, color: "#2C2C2A" }}>{c.nom}</div>
                <div style={{ fontSize: 13, color: "#8A8377", marginTop: 2 }}>{c.description}</div>
                {c.parfums?.length > 0 && (
                  <div style={{ fontSize: 12, color: "#A99B7F", marginTop: 2 }}>{c.parfums.length} parfums au choix</div>
                )}
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, color: "#000", whiteSpace: "nowrap", flexShrink: 0 }}>
                {c.prix.toFixed(0)} €
              </div>
            </div>
          ))}

          <div style={{ margin: "24px 0", padding: "18px 22px", borderRadius: 8, border: "1px solid rgba(184,147,90,0.4)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16 }}>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#D85A30", marginBottom: 3 }}>
                La spécialité de la maison
              </div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, color: "#2C2C2A" }}>Frites maison</div>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: "#000", whiteSpace: "nowrap", flexShrink: 0 }}>Offertes</div>
          </div>

          <div style={{ textAlign: "center" }}>
            <Link href="/carte" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#D85A30", borderBottom: "1px solid #D85A30" }}>
              Voir la carte complète →
            </Link>
          </div>
        </div>
      </div>

      {/* EVENEMENTS */}
      <div id="evenements" style={{ background: "#211C18", padding: "96px 32px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 36, color: "#E8DFCE", margin: "0 0 48px" }}>
            Nos événements
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 28, maxWidth: 920, margin: "0 auto", textAlign: "left" }}>
            {evenements?.map((ev) => (
              <div key={ev.id} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ width: "100%", aspectRatio: "3/4", borderRadius: 6, overflow: "hidden", background: "#2E2820" }}>
                  {ev.flyer_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={ev.flyer_url} alt={ev.titre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                </div>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#D85A30" }}>
                    {ev.date_evenement
                      ? new Date(ev.date_evenement).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })
                      : "Date à venir"}
                  </div>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, color: "#E8DFCE", marginTop: 2 }}>{ev.titre}</div>
                  <div style={{ fontSize: 13, color: "#8A8377", marginTop: 2 }}>{ev.lieu}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ALBUM */}
      <div id="album" style={{ background: "#FBF6EF", padding: "96px 32px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 36, color: "#2C2C2A", margin: "0 0 48px" }}>Album</h2>
          <div
            style={{
              display: "flex",
              gap: 16,
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
              paddingBottom: 8,
            }}
          >
            {photos?.map((p) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={p.id}
                src={p.photo_url}
                alt=""
                style={{
                  flex: "0 0 auto",
                  width: 260,
                  aspectRatio: "3/4",
                  borderRadius: 12,
                  objectFit: "cover",
                  scrollSnapAlign: "start",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* AVIS */}
      <TestimonialsCarousel />

      {/* LAISSER UN AVIS */}
      <div id="laisser-un-avis">
        <AvisForm />
      </div>

      {/* FOOTER */}
      <div style={{ background: "#211C18", padding: "32px 32px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 16, color: "#E8DFCE" }}>Kay Zouzou</span>
          <a href="https://www.instagram.com/kay_zouzou/" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#6E6558" }}>
            @kay_zouzou · tatawprod@gmail.com
          </a>
        </div>
        <div style={{ borderTop: "1px solid rgba(184,147,90,0.2)", paddingTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#8A8377", margin: 0 }}>
            L&apos;abus d&apos;alcool est dangereux pour la santé, à consommer avec modération.
          </p>
          <Link href="/mentions-legales" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#6E6558", borderBottom: "1px solid #6E6558" }}>
            Mentions légales
          </Link>
        </div>
      </div>
    </main>
  );
}

const navWrapStyle: React.CSSProperties = { position: "sticky", top: 0, zIndex: 10, background: "#211C18", borderBottom: "1px solid rgba(184,147,90,0.35)" };
const navInnerStyle: React.CSSProperties = { maxWidth: 1120, margin: "0 auto", padding: "18px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" };
const navLinksStyle: React.CSSProperties = { display: "flex", gap: 28, flexWrap: "wrap" };
const navLinkStyle: React.CSSProperties = { fontSize: 14, color: "#E8DFCE", opacity: 0.85, textDecoration: "none" };
const ctaStyle: React.CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "12px 24px", borderRadius: 4, fontSize: 14, fontWeight: 500, background: "#D85A30", color: "#FBF6EF", textDecoration: "none" };
const heroStyle: React.CSSProperties = { position: "relative", padding: "140px 32px 120px", textAlign: "center", overflow: "hidden" };
const heroOverlayStyle: React.CSSProperties = { position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(21,17,14,0.75) 0%, rgba(21,17,14,0.55) 45%, #211C18 100%), url(/hero.jpg) center/cover", zIndex: 1 };
const heroTitleStyle: React.CSSProperties = { fontFamily: "'Fraunces', serif", fontSize: 76, lineHeight: 1, color: "#F3EEE3", margin: "16px 0" };
