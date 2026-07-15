"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export interface Sede {
  id: string;
  ciudad: string;
  direccion: string;
  telefono: string;
  horario: string;
  map_url: string;
  orden: number;
}

const SEDES_FALLBACK: Sede[] = [
  {
    id: "sincelejo",
    ciudad: "Sincelejo",
    direccion: "Calle 14 No. 17-72 / Barrio Ford",
    telefono: "(+57) 300 912 7565",
    horario: "L–V 7:00 a.m.–12:00 m. / 1:00–6:00 p.m.\nSáb 7:00–11:00 a.m.",
    map_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3937.2863392021627!2d-75.3978624!3d9.307876799999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e591437c6bc9bf3%3A0xa69650ee451c291d!2sCardiocentro%20Pedi%C3%A1trico%20de%20Sucre%20IPS!5e0!3m2!1ses!2sco!4v1783651453576!5m2!1ses!2sco",
    orden: 1,
  },
  {
    id: "carmen",
    ciudad: "El Carmen de Bolívar",
    direccion: "Calle 23 No. 54-20 / Barrio Bureche",
    telefono: "(+57) 300 912 7565",
    horario: "L–V 7:00 a.m.–12:00 m. / 1:00–6:00 p.m.",
    map_url: "",
    orden: 2,
  },
  {
    id: "magangue",
    ciudad: "Magangué",
    direccion: "Calle 16 No. 12-56 / Barrio San José",
    telefono: "(+57) 300 912 7565",
    horario: "L–V 7:00 a.m.–12:00 m. / 1:00–6:00 p.m.",
    map_url: "",
    orden: 3,
  },
];

const EMAIL_FALLBACK = "info@cardiopediasucre.com";

export interface RedesSociales {
  facebook_url: string;
  instagram_url: string;
  whatsapp_url: string;
}

const REDES_FALLBACK: RedesSociales = {
  facebook_url: "",
  instagram_url: "",
  whatsapp_url: "",
};

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/gestion-interna/sitio");
}

export async function getSedes(): Promise<{ data: Sede[]; error: string | null }> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("sedes")
      .select("*")
      .order("orden", { ascending: true });
    if (error || !data?.length) return { data: SEDES_FALLBACK, error: null };
    return { data, error: null };
  } catch {
    return { data: SEDES_FALLBACK, error: null };
  }
}

export async function updateSede(
  id: string,
  fields: Partial<Omit<Sede, "id" | "orden">>
): Promise<{ error: string | null }> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("sedes").update(fields).eq("id", id);
  if (error) return { error: error.message };
  revalidateAll();
  return { error: null };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createSede(
  ciudad: string
): Promise<{ data: Sede | null; error: string | null }> {
  const supabase = createAdminClient();

  const baseId = slugify(ciudad) || "sede";
  const { data: existentes } = await supabase.from("sedes").select("id, orden");
  const idsExistentes = new Set((existentes ?? []).map((s) => s.id));

  let id = baseId;
  let n = 2;
  while (idsExistentes.has(id)) {
    id = `${baseId}-${n}`;
    n++;
  }

  const orden = (existentes ?? []).reduce((max, s) => Math.max(max, s.orden ?? 0), 0) + 1;

  const nuevaSede = { id, ciudad, direccion: "", telefono: "", horario: "", map_url: "", orden };
  const { data, error } = await supabase.from("sedes").insert(nuevaSede).select().single();
  if (error) return { data: null, error: error.message };
  revalidateAll();
  return { data, error: null };
}

export async function deleteSede(id: string): Promise<{ error: string | null }> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("sedes").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateAll();
  return { error: null };
}

export async function getEmailContacto(): Promise<string> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", "email_contacto")
      .maybeSingle();
    if (error || !data) return EMAIL_FALLBACK;
    return data.value;
  } catch {
    return EMAIL_FALLBACK;
  }
}

export async function updateEmailContacto(email: string): Promise<{ error: string | null }> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("site_config")
    .upsert({ key: "email_contacto", value: email.trim() });
  if (error) return { error: error.message };
  revalidateAll();
  return { error: null };
}

export async function getRedesSociales(): Promise<RedesSociales> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("site_config")
      .select("key, value")
      .in("key", ["facebook_url", "instagram_url", "whatsapp_url"]);
    if (error || !data?.length) return REDES_FALLBACK;
    const map = Object.fromEntries(data.map((r) => [r.key, r.value]));
    return {
      facebook_url: map.facebook_url ?? "",
      instagram_url: map.instagram_url ?? "",
      whatsapp_url: map.whatsapp_url ?? "",
    };
  } catch {
    return REDES_FALLBACK;
  }
}

export async function updateRedesSociales(
  redes: RedesSociales
): Promise<{ error: string | null }> {
  const supabase = createAdminClient();
  const rows = Object.entries(redes).map(([key, value]) => ({ key, value: value.trim() }));
  const { error } = await supabase.from("site_config").upsert(rows);
  if (error) return { error: error.message };
  revalidateAll();
  return { error: null };
}
