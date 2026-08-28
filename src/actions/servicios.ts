"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function revalidateAll() {
  revalidatePath("/servicios");
  revalidatePath("/");
  revalidatePath("/gestion-interna/servicios");
}

export async function getServicios() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("servicios")
    .select("*")
    .order("orden");

  if (error) return { data: null, error: error.message };
  return { data: data ?? [], error: null };
}

export async function getServiciosPublicos() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("servicios")
    .select("*")
    .eq("activo", true)
    .order("orden");

  if (error) return { data: null, error: error.message };
  return { data: data ?? [], error: null };
}

export interface ServicioCatalogo {
  id: string;
  titulo: string;
  categoria: string;
  icono: string;
  slug: string;
  orden: number;
}

// Catálogo completo de servicios (208 registros CUPS).
// Se distingue de los servicios destacados por descripcion = ''.
export async function getServiciosCatalogo(): Promise<{ data: ServicioCatalogo[]; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("servicios")
    .select("id, titulo, categoria, icono, slug, orden")
    .eq("activo", true)
    .eq("descripcion", "")
    .order("orden");

  if (error) return { data: [], error: error.message };
  return { data: (data ?? []) as ServicioCatalogo[], error: null };
}

export async function createServicio(fields: {
  titulo: string;
  categoria: string;
  descripcion: string;
  icono: string;
  orden: number;
  preparacion?: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("servicios").insert(fields);

  if (error) return { error: error.message };
  revalidateAll();
  return { error: null };
}

export async function updateServicio(
  id: string,
  fields: Partial<{
    titulo: string;
    categoria: string;
    descripcion: string;
    icono: string;
    orden: number;
    activo: boolean;
    preparacion: string;
  }>,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("servicios")
    .update(fields)
    .eq("id", id);

  if (error) return { error: error.message };
  revalidateAll();
  return { error: null };
}

export async function deleteServicio(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("servicios").delete().eq("id", id);

  if (error) return { error: error.message };
  revalidateAll();
  return { error: null };
}

export async function reorderServicios(items: { id: string; orden: number }[]) {
  const supabase = await createClient();
  const updates = items.map(({ id, orden }) =>
    supabase.from("servicios").update({ orden }).eq("id", id),
  );
  await Promise.all(updates);
  revalidateAll();
  return { error: null };
}
