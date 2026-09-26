-- Modération des avis clients : un avis n'apparaît sur le site public
-- (carrousel de la page d'accueil) qu'une fois validé depuis /admin.
--
-- ⚠️ La table "avis_clients" existe déjà (créée avant les migrations de ce
-- dossier, utilisée par le v1 du site vitrine) — on l'étend ici sans la
-- recréer.

alter table avis_clients add column if not exists valide boolean not null default false;

-- Les avis déjà en base datent d'avant la modération et étaient déjà publics :
-- on les considère validés pour ne pas les faire disparaître du site du jour
-- au lendemain.
update avis_clients set valide = true where valide = false;

alter table avis_clients enable row level security;

-- On ne connaît pas le nom des policies SELECT déjà en place sur cette table
-- (créées avant ce dossier de migrations) — avec plusieurs policies
-- permissives sur un même "cmd", Postgres les combine en OR, donc une
-- ancienne policy "lecture publique de tout" resterait active à côté de la
-- nôtre si on ne la supprime pas. On les supprime toutes puis on recrée une
-- policy unique et restrictive.
do $$
declare
  pol record;
begin
  for pol in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'avis_clients' and cmd = 'SELECT'
  loop
    execute format('drop policy %I on avis_clients', pol.policyname);
  end loop;
end $$;

create policy "Kay Zouzou vitrine - lecture avis validés"
  on avis_clients for select
  to anon
  using (valide = true);

-- Dépôt d'un avis (formulaire public) : policy INSERT déjà en place et
-- fonctionnelle, on n'y touche pas.

-- Modération (valider/invalider un avis) depuis /admin, protégée par mot de
-- passe côté application — même compromis que pour cocktails/evenements/
-- album_photos (voir TODO en tête de app/admin/page.tsx).
drop policy if exists "Kay Zouzou vitrine - modération avis" on avis_clients;
create policy "Kay Zouzou vitrine - modération avis"
  on avis_clients for update
  to anon
  using (true)
  with check (true);
