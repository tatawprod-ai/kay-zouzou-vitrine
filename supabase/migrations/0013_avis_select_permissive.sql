-- Corrige un blocage introduit par la migration 0012 : PostgreSQL applique
-- aussi la policy SELECT en interne lors d'un UPDATE (la ligne modifiée doit
-- rester visible sous cette policy). Comme "Kay Zouzou vitrine - lecture avis
-- validés" restreignait la lecture à `valide = true`, il devenait impossible
-- de repasser un avis à `valide = false` depuis /admin (l'UPDATE échouait
-- avec "new row violates row-level security policy"), quelle que soit la
-- policy UPDATE elle-même.
--
-- On aligne avis_clients sur le même modèle que cocktails/evenements/
-- album_photos : RLS permissif en lecture (protection uniquement par le mot
-- de passe de /admin côté application), et le filtre "valide = true" pour le
-- site public se fait côté requête (déjà en place dans
-- components/TestimonialsCarousel.tsx via .eq("valide", true)).

drop policy if exists "Kay Zouzou vitrine - lecture avis validés" on avis_clients;
create policy "Kay Zouzou vitrine - lecture avis validés"
  on avis_clients for select
  to anon
  using (true);
