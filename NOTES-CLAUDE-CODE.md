# Kay Zouzou — Site vitrine v2

Fichiers prêts à intégrer dans le repo kay-zouzou-vitrine existant.

## Étapes avant de tester

1. **Exécuter les migrations SQL** dans l'ordre, dans l'éditeur SQL Supabase :
   - 0006_cocktails.sql
   - 0007_evenements.sql
   - 0008_album_photos.sql
   - 0009_seed_cocktails.sql
   - 0010_seed_evenements.sql

2. **Créer un bucket de stockage Supabase nommé `photos`**, en accès public
   (Storage > New bucket > "photos" > Public bucket ✓).
   C'est là que l'admin uploadera les photos de cocktails, flyers et album.

3. **Compléter `.env.local`** à partir de `.env.example` :
   - `ACCESS_CODE` : le code VIP donné aux invités (déjà pré-rempli à KZVIP2026, à changer si besoin)
   - `NEXT_PUBLIC_ADMIN_CODE` : mot de passe pour la page /admin (à choisir)

4. **Photo du hero et photo de fond de la section avis** :
   les styles référencent `/hero.jpg` et `/avis-bg.jpg` (dossier `public/`).
   Il faut y déposer les deux photos de banque d'images déjà utilisées dans la maquette.

## Points à vérifier

- Les composants supposent que `@/lib`, `@/components` pointent bien vers les
  dossiers `lib/` et `components/` à la racine (alias déjà configuré dans le
  premier site, donc normalement OK).
- Le formulaire d'avis (`components/AvisForm.tsx`) réutilise la table
  `avis_clients` déjà existante — aucune migration nécessaire pour elle.
- Les policies RLS sur `cocktails`, `evenements`, `album_photos` autorisent
  l'écriture publique via la clé anon (protégée uniquement par le mot de passe
  de la page /admin côté application) — même compromis que pour le code
  d'accès de l'app principale. **Compromis accepté pour l'instant** (décision
  du 2026-09-25).

  > TODO (sécurité, pas urgent) : verrouiller `/admin` via une route API
  > serveur qui vérifie le mot de passe puis écrit dans Supabase avec une clé
  > service_role, au lieu de laisser l'écriture ouverte à la clé anon côté
  > client. Voir le même TODO en tête de `app/admin/page.tsx`.
