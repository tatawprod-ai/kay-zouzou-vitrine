"use client";

// TODO(sécurité, pas urgent) : cette page ne protège l'écriture que par un mot
// de passe côté client (NEXT_PUBLIC_ADMIN_CODE, visible dans le bundle JS) —
// les policies RLS sur cocktails/evenements/album_photos autorisent l'écriture
// publique via la clé anon, donc n'importe qui peut modifier ces tables en
// appelant l'API Supabase directement, sans passer par /admin. Compromis
// accepté pour l'instant ; à verrouiller plus tard via une route API serveur
// qui vérifie le mot de passe puis écrit avec une clé service_role.

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Cocktail, Evenement, AlbumPhoto } from "@/lib/types";

const ADMIN_CODE = process.env.NEXT_PUBLIC_ADMIN_CODE;

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState("");
  const [tab, setTab] = useState<"cocktails" | "evenements" | "album">("cocktails");

  if (!authed) {
    return (
      <main style={page}>
        <div style={{ maxWidth: 320, margin: "120px auto", textAlign: "center" }}>
          <h1 style={{ fontFamily: "'Fraunces', serif", color: "#E8DFCE" }}>Admin Kay Zouzou</h1>
          <input
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && pwd === ADMIN_CODE && setAuthed(true)}
            placeholder="Mot de passe admin"
            style={input}
          />
          <button
            onClick={() => pwd === ADMIN_CODE && setAuthed(true)}
            style={{ ...button, marginTop: 12, width: "100%" }}
          >
            Entrer
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={page}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", color: "#E8DFCE", marginBottom: 24 }}>Admin Kay Zouzou</h1>
        <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
          {(["cocktails", "evenements", "album"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{ ...button, background: tab === t ? "#D85A30" : "#2E2820" }}>
              {t === "cocktails" ? "Cocktails" : t === "evenements" ? "Événements" : "Album"}
            </button>
          ))}
        </div>
        {tab === "cocktails" && <CocktailsAdmin />}
        {tab === "evenements" && <EvenementsAdmin />}
        {tab === "album" && <AlbumAdmin />}
      </div>
    </main>
  );
}

// --- Upload helper ---
async function uploadFile(file: File, folder: string): Promise<string | null> {
  const path = `${folder}/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from("photos").upload(path, file);
  if (error) {
    alert("Erreur upload : " + error.message);
    return null;
  }
  const { data } = supabase.storage.from("photos").getPublicUrl(path);
  return data.publicUrl;
}

// --- Cocktails ---
function CocktailsAdmin() {
  const [items, setItems] = useState<Cocktail[]>([]);
  const empty: Partial<Cocktail> = { nom: "", description: "", prix: 0, categorie: "avec_alcool", parfums: [], mis_en_avant: false, actif: true, position: 0 };
  const [form, setForm] = useState<Partial<Cocktail>>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase.from("cocktails").select("*").order("position").returns<Cocktail[]>();
    setItems(data || []);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    const payload = { ...form, parfums: form.parfums ?? [] };
    if (editingId) {
      await supabase.from("cocktails").update(payload).eq("id", editingId);
    } else {
      await supabase.from("cocktails").insert(payload);
    }
    setForm(empty);
    setEditingId(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Supprimer ce cocktail ?")) return;
    await supabase.from("cocktails").delete().eq("id", id);
    load();
  }

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, "cocktails");
    if (url) setForm((f) => ({ ...f, photo_url: url }));
  }

  return (
    <div>
      <div style={card}>
        <h3 style={h3}>{editingId ? "Modifier" : "Ajouter"} un cocktail</h3>
        <div style={grid2}>
          <input style={input} placeholder="Nom" value={form.nom ?? ""} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
          <input style={input} type="number" placeholder="Prix €" value={form.prix ?? 0} onChange={(e) => setForm({ ...form, prix: Number(e.target.value) })} />
        </div>
        <input style={{ ...input, width: "100%", marginTop: 10 }} placeholder="Description (ingrédients)" value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div style={{ ...grid2, marginTop: 10 }}>
          <select style={input} value={form.categorie ?? "avec_alcool"} onChange={(e) => setForm({ ...form, categorie: e.target.value as Cocktail["categorie"] })}>
            <option value="avec_alcool">Avec alcool</option>
            <option value="sans_alcool">Sans alcool</option>
            <option value="offert">Offert</option>
          </select>
          <input style={input} placeholder="Note spéciale (optionnel)" value={form.note_speciale ?? ""} onChange={(e) => setForm({ ...form, note_speciale: e.target.value })} />
        </div>
        <input
          style={{ ...input, width: "100%", marginTop: 10 }}
          placeholder="Parfums (séparés par une virgule)"
          value={(form.parfums ?? []).join(", ")}
          onChange={(e) => setForm({ ...form, parfums: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
          <label style={{ color: "#B8AFA1", fontSize: 13 }}>
            <input type="checkbox" checked={!!form.mis_en_avant} onChange={(e) => setForm({ ...form, mis_en_avant: e.target.checked })} /> Mis en avant sur l&apos;accueil
          </label>
          <label style={{ color: "#B8AFA1", fontSize: 13 }}>
            <input type="checkbox" checked={form.actif ?? true} onChange={(e) => setForm({ ...form, actif: e.target.checked })} /> Actif
          </label>
          <input style={{ ...input, width: 80 }} type="number" placeholder="Ordre" value={form.position ?? 0} onChange={(e) => setForm({ ...form, position: Number(e.target.value) })} />
        </div>
        <div style={{ marginTop: 10 }}>
          <input type="file" accept="image/*" onChange={handlePhoto} />
          {form.photo_url && <span style={{ color: "#8A8377", fontSize: 12, marginLeft: 8 }}>Photo ajoutée ✓</span>}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button style={button} onClick={save}>{editingId ? "Enregistrer" : "Ajouter"}</button>
          {editingId && <button style={{ ...button, background: "#3A342C" }} onClick={() => { setForm(empty); setEditingId(null); }}>Annuler</button>}
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        {items.map((c) => (
          <div key={c.id} style={row}>
            <div>
              <strong style={{ color: "#E8DFCE" }}>{c.nom}</strong>{" "}
              <span style={{ color: "#8A8377", fontSize: 13 }}>{c.prix} € · {c.categorie}{!c.actif ? " · inactif" : ""}</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={smallBtn} onClick={() => { setForm(c); setEditingId(c.id); }}>Modifier</button>
              <button style={{ ...smallBtn, background: "#5A2E24" }} onClick={() => remove(c.id)}>Suppr.</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Événements ---
function EvenementsAdmin() {
  const [items, setItems] = useState<Evenement[]>([]);
  const empty: Partial<Evenement> = { titre: "", date_evenement: null, lieu: "Kay Zouzou Home Bar", actif: true, position: 0 };
  const [form, setForm] = useState<Partial<Evenement>>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase.from("evenements").select("*").order("position").returns<Evenement[]>();
    setItems(data || []);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    if (editingId) {
      await supabase.from("evenements").update(form).eq("id", editingId);
    } else {
      await supabase.from("evenements").insert(form);
    }
    setForm(empty);
    setEditingId(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cet événement ?")) return;
    await supabase.from("evenements").delete().eq("id", id);
    load();
  }

  async function handleFlyer(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, "evenements");
    if (url) setForm((f) => ({ ...f, flyer_url: url }));
  }

  return (
    <div>
      <div style={card}>
        <h3 style={h3}>{editingId ? "Modifier" : "Ajouter"} un événement</h3>
        <div style={grid2}>
          <input style={input} placeholder="Titre" value={form.titre ?? ""} onChange={(e) => setForm({ ...form, titre: e.target.value })} />
          <input style={input} type="date" value={form.date_evenement ?? ""} onChange={(e) => setForm({ ...form, date_evenement: e.target.value || null })} />
        </div>
        <input style={{ ...input, width: "100%", marginTop: 10 }} placeholder="Lieu" value={form.lieu ?? ""} onChange={(e) => setForm({ ...form, lieu: e.target.value })} />
        <div style={{ marginTop: 10 }}>
          <input type="file" accept="image/*" onChange={handleFlyer} />
          {form.flyer_url && <span style={{ color: "#8A8377", fontSize: 12, marginLeft: 8 }}>Flyer ajouté ✓</span>}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button style={button} onClick={save}>{editingId ? "Enregistrer" : "Ajouter"}</button>
          {editingId && <button style={{ ...button, background: "#3A342C" }} onClick={() => { setForm(empty); setEditingId(null); }}>Annuler</button>}
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        {items.map((ev) => (
          <div key={ev.id} style={row}>
            <div>
              <strong style={{ color: "#E8DFCE" }}>{ev.titre}</strong>{" "}
              <span style={{ color: "#8A8377", fontSize: 13 }}>{ev.date_evenement ?? "date à venir"}</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={smallBtn} onClick={() => { setForm(ev); setEditingId(ev.id); }}>Modifier</button>
              <button style={{ ...smallBtn, background: "#5A2E24" }} onClick={() => remove(ev.id)}>Suppr.</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Album ---
function AlbumAdmin() {
  const [items, setItems] = useState<AlbumPhoto[]>([]);

  async function load() {
    const { data } = await supabase.from("album_photos").select("*").order("position").returns<AlbumPhoto[]>();
    setItems(data || []);
  }
  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, "album");
    if (url) {
      await supabase.from("album_photos").insert({ photo_url: url, position: items.length });
      load();
    }
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cette photo ?")) return;
    await supabase.from("album_photos").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <div style={card}>
        <h3 style={h3}>Ajouter une photo</h3>
        <input type="file" accept="image/*" onChange={handleAdd} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10, marginTop: 24 }}>
        {items.map((p) => (
          <div key={p.id} style={{ position: "relative" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.photo_url} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 6 }} />
            <button onClick={() => remove(p.id)} style={{ position: "absolute", top: 4, right: 4, ...smallBtn, background: "#5A2E24" }}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Styles ---
const page: React.CSSProperties = { background: "#211C18", minHeight: "100dvh", fontFamily: "'Work Sans', sans-serif" };
const card: React.CSSProperties = { background: "#2E2820", borderRadius: 10, padding: 20 };
const h3: React.CSSProperties = { color: "#E8DFCE", fontFamily: "'Fraunces', serif", margin: "0 0 14px", fontSize: 18 };
const grid2: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 };
const input: React.CSSProperties = { padding: "10px 12px", borderRadius: 6, border: "1px solid rgba(184,147,90,0.4)", background: "#1E1A16", color: "#E8DFCE", fontSize: 14 };
const button: React.CSSProperties = { padding: "10px 18px", borderRadius: 6, border: "none", background: "#D85A30", color: "#FBF6EF", fontWeight: 500, cursor: "pointer" };
const smallBtn: React.CSSProperties = { padding: "6px 12px", borderRadius: 6, border: "none", background: "#3A342C", color: "#E8DFCE", fontSize: 12, cursor: "pointer" };
const row: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(184,147,90,0.2)" };
