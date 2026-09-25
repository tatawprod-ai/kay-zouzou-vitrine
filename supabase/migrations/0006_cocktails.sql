-- Table des cocktails du menu Kay Zouzou
-- ⚠️ La table "cocktails" existe déjà (créée avant la migration 0005, utilisée par
-- le v1 du site vitrine et par l'app opérationnelle). "create table if not exists"
-- est donc un no-op ici : on ajoute les nouvelles colonnes du v2 via ALTER TABLE
-- pour ne pas perdre les données existantes (12 cocktails déjà en prod).
-- ⚠️ Constaté en exécutant cette migration en prod (2026-09) :
--   - "categorie" existait déjà en base, avec une contrainte check antérieure
--     autorisant 'avec_alcool' / 'sans_alcool' / 'offert' (pas 'spiritueux').
--     Le check ci-dessous reprend ces valeurs réelles.
--   - "description" manquait réellement en base malgré sa présence dans le
--     create table ci-dessus (la table pré-existante ne l'avait jamais eue) —
--     d'où l'ADD COLUMN explicite juste en dessous, pour que cette migration
--     reste rejouable telle quelle sur un environnement neuf ou déjà partiel.
create table if not exists cocktails (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  description text,
  prix numeric(5,2) not null,
  actif boolean not null default true,
  created_at timestamptz not null default now()
);

alter table cocktails add column if not exists description text;

alter table cocktails add column if not exists categorie text not null default 'avec_alcool';
alter table cocktails drop constraint if exists cocktails_categorie_check;
alter table cocktails add constraint cocktails_categorie_check check (categorie in ('avec_alcool', 'sans_alcool', 'offert'));

alter table cocktails add column if not exists parfums text[] default '{}';        -- ex: {'Fruit rouge','Fraise','Litchi'}
alter table cocktails add column if not exists note_speciale text;                  -- ex: "Ingrédient spécial du barman"
alter table cocktails add column if not exists photo_url text;                      -- optionnel, pour les cocktails mis en avant sur l'accueil
alter table cocktails add column if not exists mis_en_avant boolean not null default false; -- true = affiché sur la page d'accueil
alter table cocktails add column if not exists position integer not null default 0; -- ordre d'affichage

alter table cocktails enable row level security;

drop policy if exists "Lecture publique des cocktails actifs" on cocktails;
create policy "Lecture publique des cocktails actifs"
  on cocktails for select
  to anon
  using (actif = true);

-- Écriture réservée à l'admin (passe par la clé anon depuis la page /admin,
-- protégée par mot de passe côté application — même principe que kay-zouzou-app)
drop policy if exists "Écriture des cocktails" on cocktails;
create policy "Écriture des cocktails"
  on cocktails for all
  to anon
  using (true)
  with check (true);

create index if not exists idx_cocktails_categorie on cocktails(categorie, position);
