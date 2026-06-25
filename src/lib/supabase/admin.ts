import { createClient } from "@supabase/supabase-js";

// ADVERTENCIA: Este cliente usa la service_role key, que bypasea RLS.
// SOLO importar desde código server-side (Server Actions, Route Handlers, scripts).
// NUNCA importar desde Client Components ni exponer al navegador.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
