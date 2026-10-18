-- Le téléphone devient obligatoire (il sert à envoyer le code VIP après
-- confirmation). Même règle que lib/inscriptionRules.ts : 9 à 15 chiffres,
-- séparateurs (espaces, +, tirets…) ignorés. Seconde barrière si une autre voie
-- que /api/inscriptions écrivait un jour dans la table.
-- Exécutée alors que la table est vide : aucune donnée existante à corriger.
alter table inscriptions alter column telephone set not null;

alter table inscriptions drop constraint if exists inscriptions_telephone_chiffres;
alter table inscriptions add constraint inscriptions_telephone_chiffres
  check (length(regexp_replace(telephone, '\D', '', 'g')) between 9 and 15);
