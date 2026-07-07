"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function revalidateAll() {
  revalidatePath("/equipo");
  revalidatePath("/equipo/tecnologico");
  revalidatePath("/gestion-interna/equipo/humano");
  revalidatePath("/gestion-interna/equipo/tecnologico");
}

// ── Hero ─────────────────────────────────────────────────────

export async function getEquipoHero(pagina: "humano" | "tecnologico") {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("equipo_hero")
    .select("*")
    .eq("pagina", pagina)
    .maybeSingle();
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function updateEquipoHero(
  pagina: "humano" | "tecnologico",
  fields: { imagen_url?: string; imagen_alt?: string }
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("equipo_hero")
    .update(fields)
    .eq("pagina", pagina);
  if (error) return { error: error.message };
  revalidateAll();
  return { error: null };
}

// ── Grupos + miembros ────────────────────────────────────────

export async function getEquipoGrupos() {
  const supabase = await createClient();
  const { data: grupos, error: gError } = await supabase
    .from("equipo_grupos")
    .select("*")
    .order("orden", { ascending: true });
  if (gError) return { data: null, error: gError.message };

  const { data: miembros, error: mError } = await supabase
    .from("equipo_miembros")
    .select("*")
    .order("orden", { ascending: true });
  if (mError) return { data: null, error: mError.message };

  const result = (grupos ?? []).map((g) => ({
    ...g,
    miembros: (miembros ?? []).filter((m) => m.grupo_id === g.id),
  }));
  return { data: result, error: null };
}

export async function createEquipoMiembro(fields: {
  grupo_id: string;
  nombre: string;
  cargo: string;
  especialidad: string;
  formacion: string[];
  foto_url: string;
  imagen_alt: string;
  orden: number;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("equipo_miembros").insert(fields);
  if (error) return { error: error.message };
  revalidateAll();
  return { error: null };
}

export async function updateEquipoMiembro(
  id: string,
  fields: {
    nombre?: string;
    cargo?: string;
    especialidad?: string;
    formacion?: string[];
    foto_url?: string;
    imagen_alt?: string;
    activo?: boolean;
    orden?: number;
  }
) {
  const supabase = await createClient();
  const { error } = await supabase.from("equipo_miembros").update(fields).eq("id", id);
  if (error) return { error: error.message };
  revalidateAll();
  return { error: null };
}

export async function deleteEquipoMiembro(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("equipo_miembros").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateAll();
  return { error: null };
}

export async function reorderEquipoMiembros(items: { id: string; orden: number }[]) {
  const supabase = await createClient();
  for (const { id, orden } of items) {
    const { error } = await supabase.from("equipo_miembros").update({ orden }).eq("id", id);
    if (error) return { error: error.message };
  }
  revalidateAll();
  return { error: null };
}

// ── Equipo tecnológico ───────────────────────────────────────

export async function getEquipoTecnologico() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("equipo_tecnologico")
    .select("*")
    .order("orden", { ascending: true });
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function createEquipoTec(fields: {
  nombre: string;
  categoria: string;
  descripcion: string;
  imagen_url: string;
  imagen_alt: string;
  orden: number;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("equipo_tecnologico").insert(fields);
  if (error) return { error: error.message };
  revalidateAll();
  return { error: null };
}

export async function updateEquipoTec(
  id: string,
  fields: {
    nombre?: string;
    categoria?: string;
    descripcion?: string;
    imagen_url?: string;
    imagen_alt?: string;
    activo?: boolean;
    orden?: number;
  }
) {
  const supabase = await createClient();
  const { error } = await supabase.from("equipo_tecnologico").update(fields).eq("id", id);
  if (error) return { error: error.message };
  revalidateAll();
  return { error: null };
}

export async function deleteEquipoTec(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("equipo_tecnologico").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateAll();
  return { error: null };
}

export async function reorderEquipoTec(items: { id: string; orden: number }[]) {
  const supabase = await createClient();
  for (const { id, orden } of items) {
    const { error } = await supabase.from("equipo_tecnologico").update({ orden }).eq("id", id);
    if (error) return { error: error.message };
  }
  revalidateAll();
  return { error: null };
}
