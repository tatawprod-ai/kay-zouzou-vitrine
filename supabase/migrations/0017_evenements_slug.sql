-- Nom court facultatif pour les liens d'inscription (/inscription/<slug>).
-- Aucune donnée existante n'est modifiée : la colonne est ajoutée vide (NULL).
alter table evenements add column if not exists slug text;

-- Minuscules, chiffres et tirets simples (ni au début ni à la fin), 40 caractères max.
-- Même règle que lib/slug.ts (proxy et page /inscription/[slug]).
alter table evenements drop constraint if exists evenements_slug_format;
alter table evenements add constraint evenements_slug_format check (
  slug is null
  or (char_length(slug) between 1 and 40 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

-- Unicité : plusieurs événements peuvent rester sans slug (NULL), jamais deux fois le même.
create unique index if not exists evenements_slug_unique on evenements (slug);
