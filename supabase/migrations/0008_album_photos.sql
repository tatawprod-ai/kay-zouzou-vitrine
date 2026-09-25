-- Table des photos de l'album Kay Zouzou
create table if not exists album_photos (
  id uuid primary key default gen_random_uuid(),
  photo_url text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

alter table album_photos enable row level security;

drop policy if exists "Lecture publique de l'album" on album_photos;
create policy "Lecture publique de l'album"
  on album_photos for select
  to anon
  using (true);

drop policy if exists "Écriture de l'album" on album_photos;
create policy "Écriture de l'album"
  on album_photos for all
  to anon
  using (true)
  with check (true);

create index if not exists idx_album_position on album_photos(position);
