-- Limite anti-spam du formulaire de préinscription : une ligne par tentative
-- d'envoi (réussie ou refusée). L'IP n'est jamais stockée en clair, seulement
-- une empreinte HMAC calculée côté serveur. La route /api/inscriptions compte
-- les tentatives des 10 dernières minutes et purge celles de plus de 24 h.
-- Table fermée à la clé publique, comme inscriptions (0014) : accès service_role uniquement.
create table if not exists inscriptions_tentatives (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_inscriptions_tentatives_ip_date
  on inscriptions_tentatives (ip_hash, created_at);

alter table inscriptions_tentatives enable row level security;
-- Aucune policy volontairement.

revoke all on inscriptions_tentatives from anon, authenticated;
