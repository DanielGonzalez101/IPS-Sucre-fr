import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface PermisoCheck {
  ok: boolean;
  motivo?: "sin_sesion" | "suspendido" | "sin_permiso";
  perfil?: { id: string; estado: string; modulos_permitidos: string[]; role: string };
}

// Verifica sesión + estado + permiso de módulo del usuario autenticado actual.
// Si la tabla profiles aún no existe (migración pendiente en Supabase), deja
// pasar — comportamiento de transición acordado para no romper el panel.
export async function checkModulePermission(moduloSlug: string): Promise<PermisoCheck> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, motivo: "sin_sesion" };

  const admin = createAdminClient();
  const { data: perfil, error } = await admin
    .from("profiles")
    .select("id, estado, modulos_permitidos, role")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !perfil) return { ok: true };
  if (perfil.estado === "suspendido") return { ok: false, motivo: "suspendido" };
  if (!perfil.modulos_permitidos.includes(moduloSlug)) {
    return { ok: false, motivo: "sin_permiso", perfil };
  }
  return { ok: true, perfil };
}
