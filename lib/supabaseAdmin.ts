import "server-only";
import { createClient } from "@supabase/supabase-js";

// Client Supabase avec la clé service_role : contourne RLS, donc réservé au
// serveur. `server-only` fait échouer le build si un composant client l'importe.
// La variable n'a volontairement pas de préfixe NEXT_PUBLIC_ (jamais envoyée au navigateur).
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant côté serveur.");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
