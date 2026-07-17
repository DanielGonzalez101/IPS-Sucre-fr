"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkModulePermission } from "@/lib/permisos-server";
import { generarPasswordTemporal } from "@/lib/generar-password";
import { usuarioSchema } from "@/lib/validations/usuario";
import { MODULOS, USUARIOS_PAGE_SIZE } from "@/lib/permisos";
import type { UsuarioAdmin, UsuariosPage } from "@/types";

function revalidateAll() {
  revalidatePath("/gestion-interna/usuarios");
}

const MIGRACION_PENDIENTE =
  "El módulo de usuarios requiere una migración pendiente en Supabase. Ejecuta sql/01_usuarios/001_profiles_permisos.sql.";

export async function getUsuarios(page = 0, incluirSuspendidos = false): Promise<UsuariosPage> {
  const permiso = await checkModulePermission("usuarios");
  if (!permiso.ok) {
    return { data: [], total: 0, pageCount: 0, error: "No tienes permiso para este módulo." };
  }

  const admin = createAdminClient();
  const from = page * USUARIOS_PAGE_SIZE;
  const to = from + USUARIOS_PAGE_SIZE - 1;

  let query = admin
    .from("profiles")
    .select("id, email, nombre, role, modulos_permitidos, estado, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (!incluirSuspendidos) query = query.eq("estado", "activo");

  const { data, error, count } = await query;
  if (error) return { data: [], total: 0, pageCount: 0, error: MIGRACION_PENDIENTE };

  return {
    data: data ?? [],
    total: count ?? 0,
    pageCount: Math.ceil((count ?? 0) / USUARIOS_PAGE_SIZE),
    error: null,
  };
}

export async function createUsuario(input: {
  email: string;
  nombre: string;
  role: "admin" | "editor" | "viewer";
  modulos_permitidos: string[];
}): Promise<{ data: { usuario: UsuarioAdmin; passwordTemporal: string } | null; error: string | null }> {
  const permiso = await checkModulePermission("usuarios");
  if (!permiso.ok) return { data: null, error: "No tienes permiso para este módulo." };

  const parsed = usuarioSchema.safeParse(input);
  if (!parsed.success) {
    return { data: null, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const admin = createAdminClient();
  const passwordTemporal = generarPasswordTemporal();

  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email: parsed.data.email,
    password: passwordTemporal,
    email_confirm: true,
  });

  if (authError || !authData.user) {
    return { data: null, error: authError?.message ?? "No se pudo crear el usuario" };
  }

  // El trigger on_auth_user_created ya insertó una fila básica; la completamos.
  const { data: perfil, error: perfilError } = await admin
    .from("profiles")
    .update({
      nombre: parsed.data.nombre,
      role: parsed.data.role,
      modulos_permitidos: parsed.data.modulos_permitidos,
    })
    .eq("id", authData.user.id)
    .select("id, email, nombre, role, modulos_permitidos, estado, created_at")
    .single();

  if (perfilError || !perfil) {
    return { data: null, error: perfilError?.message ?? "Usuario creado, pero no se pudo guardar su perfil" };
  }

  // TODO: enviar email con la contraseña temporal al usuario (Resend/SES/etc.)
  // cuando se integre un proveedor de correo. Por ahora se retorna para
  // mostrarse una única vez en pantalla.

  revalidateAll();
  return { data: { usuario: perfil, passwordTemporal }, error: null };
}

export async function updateUsuarioPermisos(
  id: string,
  fields: Partial<{ role: "admin" | "editor" | "viewer"; modulos_permitidos: string[] }>
): Promise<{ error: string | null }> {
  const permiso = await checkModulePermission("usuarios");
  if (!permiso.ok) return { error: "No tienes permiso para este módulo." };

  if (fields.modulos_permitidos) {
    const slugsValidos = new Set(MODULOS.map((m) => m.slug));
    const invalido = fields.modulos_permitidos.find((s) => !slugsValidos.has(s));
    if (invalido) return { error: `Módulo desconocido: ${invalido}` };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("profiles").update(fields).eq("id", id);
  if (error) return { error: error.message };

  revalidateAll();
  return { error: null };
}

async function cambiarEstado(id: string, estado: "activo" | "suspendido"): Promise<{ error: string | null }> {
  const permiso = await checkModulePermission("usuarios");
  if (!permiso.ok) return { error: "No tienes permiso para este módulo." };

  if (estado === "suspendido") {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user?.id === id) {
      return { error: "No puedes suspender tu propia cuenta." };
    }
  }

  const admin = createAdminClient();
  const { error } = await admin.from("profiles").update({ estado }).eq("id", id);
  if (error) return { error: error.message };

  revalidateAll();
  return { error: null };
}

export async function suspenderUsuario(id: string): Promise<{ error: string | null }> {
  return cambiarEstado(id, "suspendido");
}

export async function reactivarUsuario(id: string): Promise<{ error: string | null }> {
  return cambiarEstado(id, "activo");
}

export async function regenerarPassword(
  id: string
): Promise<{ data: { passwordTemporal: string } | null; error: string | null }> {
  const permiso = await checkModulePermission("usuarios");
  if (!permiso.ok) return { data: null, error: "No tienes permiso para este módulo." };

  const admin = createAdminClient();
  const passwordTemporal = generarPasswordTemporal();

  const { error } = await admin.auth.admin.updateUserById(id, { password: passwordTemporal });
  if (error) return { data: null, error: error.message };

  // TODO: enviar email con la nueva contraseña temporal cuando se integre
  // un proveedor de correo.

  return { data: { passwordTemporal }, error: null };
}
