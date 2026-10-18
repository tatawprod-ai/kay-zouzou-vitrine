-- Préinscription publique aux événements.
-- Table fermée à la clé publique : RLS activé SANS aucune policy, et droits
-- retirés à anon/authenticated. Lecture/écriture uniquement côté serveur avec
-- la clé service_role (SUPABASE_SERVICE_ROLE_KEY, jamais préfixée NEXT_PUBLIC_).
create table if not exists inscriptions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  evenement_id uuid not null references evenements (id) on delete cascade,
  prenom text not null,
  nom text not null,
  email text not null,
  telephone text,
  nb_personnes integer not null default 1 check (nb_personnes between 1 and 10),
  message text,
  consentement boolean not null check (consentement = true),
  statut text not null default 'en_attente'
    check (statut in ('en_attente', 'confirmee', 'refusee'))
);

create index if not exists idx_inscriptions_evenement_id on inscriptions (evenement_id);

alter table inscriptions enable row level security;
-- Aucune policy volontairement.

-- Seconde barrière : même si une policy était ajoutée par erreur un jour,
-- anon/authenticated n'ont aucun droit sur la table.
revoke all on inscriptions from anon, authenticated;
