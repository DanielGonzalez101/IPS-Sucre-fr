"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function revalidateAll() {
  revalidatePath("/noticias");
  revalidatePath("/");
  revalidatePath("/gestion-interna/noticias");
}

export async function getNoticias() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("noticias")
    .select("*")
    .order("fecha", { ascending: false });

  if (error) return { data: null, error: error.message };
  return { data: data ?? [], error: null };
}

export async function getNoticiasPublicas() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("noticias")
    .select("*")
    .eq("activo", true)
    .order("fecha", { ascending: false });

  if (error) return { data: null, error: error.message };
  return { data: data ?? [], error: null };
}

export async function createNoticia(fields: {
  slug: string;
  titulo: string;
  extracto: string;
  tag: string;
  img_url: string;
  fecha: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("noticias")
    .insert({ ...fields, activo: true, vistas: 0 });

  if (error) return { error: error.message };
  revalidateAll();
  return { error: null };
}

export async function updateNoticia(
  id: string,
  fields: Partial<{
    slug: string;
    titulo: string;
    extracto: string;
    tag: string;
    img_url: string;
    fecha: string;
    activo: boolean;
  }>,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("noticias")
    .update(fields)
    .eq("id", id);

  if (error) return { error: error.message };
  revalidateAll();
  return { error: null };
}

export async function deleteNoticia(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("noticias").delete().eq("id", id);

  if (error) return { error: error.message };
  revalidateAll();
  return { error: null };
}
