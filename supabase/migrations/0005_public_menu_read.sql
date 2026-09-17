-- Autorise la lecture publique de la table des cocktails pour le site vitrine.
-- ⚠️ Remplace "cocktails" par le nom réel de ta table si différent.
-- Si une policy de lecture publique existe déjà (ex: l'app interne utilise
-- aussi la clé anon), cette étape n'est pas nécessaire.

alter table cocktails enable row level security;

create policy "Lecture publique du menu"
  on cocktails for select
  to anon
  using (actif = true);
