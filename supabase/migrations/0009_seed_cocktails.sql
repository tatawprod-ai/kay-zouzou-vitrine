-- Données initiales des cocktails Kay Zouzou
-- photo_url laissé vide : à uploader ensuite depuis la page /admin
-- (les 4 mises en avant sur l'accueil : Basilic Smash, Moscow Mule, Porn Star Martini, Mojito)
--
-- ⚠️ 12 de ces cocktails existent déjà en prod (insérés avant le v2, sans les
-- colonnes categorie/parfums/mis_en_avant/position). Pour ne pas créer de doublons
-- ni écraser un prix/une description modifiés depuis, on n'insère ici que les
-- noms absents de la table — les cocktails déjà présents ne sont PAS mis à jour,
-- à l'exception de "Porn Star" ci-dessous.
-- Une fois la migration passée, va sur /admin pour marquer "mis en avant",
-- choisir la catégorie et les parfums des autres cocktails déjà existants.

-- "Porn Star" déjà en prod == "Porn Star Martini" de ce seed (confirmé) : on met
-- à jour la ligne existante (renommage + complément v2) plutôt que d'insérer un
-- doublon. Idempotent : si déjà renommée, ce UPDATE ne matche plus rien.
update cocktails set
  nom = 'Porn Star Martini',
  description = 'Vodka vanille · purée de fruit de la passion · liqueur de fruit de la passion · prosecco',
  prix = 8,
  categorie = 'avec_alcool',
  parfums = '{}'::text[],
  note_speciale = null,
  mis_en_avant = true,
  position = 9
where nom = 'Porn Star';

insert into cocktails (nom, description, prix, categorie, parfums, note_speciale, mis_en_avant, position)
select v.nom, v.description, v.prix, v.categorie, v.parfums, v.note_speciale, v.mis_en_avant, v.position
from (values
  ('Ti Punch', 'Rhum agricole · citron vert · sirop simple', 3::numeric, 'avec_alcool', '{}'::text[], 'Déclinaison Gingembre', false, 1),
  ('Caïpirinha', 'Cachaça · citron vert · sirop simple · glace pilée', 5::numeric, 'avec_alcool', '{"Fruit rouge","Fraise","Litchi","Mangue","Passion","Ananas","Cerise","Pomme verte"}'::text[], null, false, 2),
  ('Mojito', 'Rhum blanc · menthe fraîche · citron vert · sucre · eau gazeuse', 5::numeric, 'avec_alcool', '{"Fruit rouge","Fraise","Litchi","Mangue","Passion","Ananas","Cerise","Pomme verte"}'::text[], null, true, 3),
  ('Basilic Smash', 'Gin · basilic frais · citron vert · sirop simple', 5::numeric, 'avec_alcool', '{}'::text[], null, true, 4),
  ('Caïpirinha do Brazil', 'Cachaça · citron vert · sirop simple · glace pilée', 6::numeric, 'avec_alcool', '{}'::text[], 'Ingrédient spécial du barman', false, 5),
  ('Mojito Royal', 'Rhum blanc · menthe · citron vert · sirop simple · Prosecco', 8::numeric, 'avec_alcool', '{}'::text[], null, false, 6),
  ('Moscow Mule', 'Vodka · citron vert · sirop simple · ginger beer', 8::numeric, 'avec_alcool', '{}'::text[], null, true, 7),
  ('Maï Thaï', 'Rhum épicé · rhum blanc · triple sec · orgeat · citron vert', 8::numeric, 'avec_alcool', '{}'::text[], null, false, 8),
  ('Long Island', 'Rhum blanc · gin · vodka · tequila · triple sec · jus de citron jaune · sirop simple · coca', 8::numeric, 'avec_alcool', '{}'::text[], null, false, 10),
  ('Dark and Stormy', 'Rhum noir épicé · citron vert · sirop simple · ginger beer', 5::numeric, 'avec_alcool', '{}'::text[], null, false, 11),
  ('Cuba Libre', 'Rhum sud-américain · coca · citron vert', 5::numeric, 'avec_alcool', '{}'::text[], null, false, 12),
  ('Mojito Virgin', 'Menthe · citron vert · sucre de canne · soda', 3::numeric, 'sans_alcool', '{"Fruit rouge","Fraise","Litchi","Mangue","Passion","Ananas","Cerise","Pomme verte"}'::text[], null, false, 13),
  ('Moscow Mule Virgin', 'Ginger beer · citron vert · sirop simple · soda', 3::numeric, 'sans_alcool', '{}'::text[], null, false, 14),
  ('Cosmopolitain', 'Jus de cranberry · jus d''orange · jus de citron vert', 3::numeric, 'sans_alcool', '{}'::text[], null, false, 15),
  ('Éclat Tropical au basilic', 'Jus d''ananas · jus de mangue · sirop de citron · basilic · eau gazeuse', 3::numeric, 'sans_alcool', '{}'::text[], null, false, 16),
  ('Mocktail pomme verte et gingembre', 'Jus de pomme verte · sirop de gingembre · jus de citron · eau gazeuse', 3::numeric, 'sans_alcool', '{}'::text[], null, false, 17)
) as v(nom, description, prix, categorie, parfums, note_speciale, mis_en_avant, position)
where not exists (select 1 from cocktails c where c.nom = v.nom);

-- Frites maison : gérées à part car offertes, pas un cocktail (à afficher en dur ou via une table dédiée si besoin plus tard)
