-- Table des événements Kay Zouzou
create table if not exists evenements (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  date_evenement date,              -- null autorisé pour "Date à venir"
  lieu text,
  flyer_url text,
  position integer not null default 0,
  actif boolean not null default true,
  created_at timestamptz not null default now()
);

alter table evenements enable row level security;

drop policy if exists "Lecture publique des événements actifs" on evenements;
create policy "Lecture publique des événements actifs"
  on evenements for select
  to anon
  using (actif = true);

drop policy if exists "Écriture des événements" on evenements;
create policy "Écriture des événements"
  on evenements for all
  to anon
  using (true)
  with check (true);

create index if not exists idx_evenements_position on evenements(position);
