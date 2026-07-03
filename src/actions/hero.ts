"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function getHeroSlides() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hero_slides")
    .select("*")
    .order("es_principal", { ascending: false })
    .order("orden", { ascending: true });

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function updateHeroSlide(
  id: string,
  fields: {
    badge_texto?: string;
    titulo?: string;
    subtitulo?: string;
    imagen_url?: string;
    imagen_alt?: string;
    activo?: boolean;
    orden?: number;
  }
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("hero_slides")
    .update(fields)
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/gestion-interna/hero");
  return { error: null };
}

export async function createHeroSlide(fields: {
  badge_texto?: string;
  titulo: string;
  subtitulo?: string;
  imagen_url: string;
  imagen_alt: string;
  orden?: number;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("hero_slides").insert(fields);

  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/gestion-interna/hero");
  return { error: null };
}

export async function reorderSlides(items: { id: string; orden: number }[]) {
  const supabase = await createClient();
  for (const { id, orden } of items) {
    const { error } = await supabase
      .from("hero_slides")
      .update({ orden })
      .eq("id", id);
    if (error) return { error: error.message };
  }
  revalidatePath("/");
  revalidatePath("/gestion-interna/hero");
  return { error: null };
}

export async function swapSlideOrden(
  idA: string,
  ordenA: number,
  idB: string,
  ordenB: number
) {
  const supabase = await createClient();

  const { error: e1 } = await supabase
    .from("hero_slides")
    .update({ orden: ordenB })
    .eq("id", idA);

  if (e1) return { error: e1.message };

  const { error: e2 } = await supabase
    .from("hero_slides")
    .update({ orden: ordenA })
    .eq("id", idB);

  if (e2) return { error: e2.message };

  revalidatePath("/");
  revalidatePath("/gestion-interna/hero");
  return { error: null };
}

export async function setAsPrincipal(id: string) {
  const supabase = await createClient();

  // Desmarcar todos
  const { error: clearError } = await supabase
    .from("hero_slides")
    .update({ es_principal: false })
    .neq("id", id);

  if (clearError) return { error: clearError.message };

  // Marcar el seleccionado
  const { error } = await supabase
    .from("hero_slides")
    .update({ es_principal: true })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/gestion-interna/hero");
  return { error: null };
}

export async function deleteHeroSlide(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("hero_slides").delete().eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/gestion-interna/hero");
  return { error: null };
}