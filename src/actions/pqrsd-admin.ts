"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export type PqrsdStatus = "recibido" | "en_revision" | "en_tramite" | "respondido" | "cerrado";

export interface PqrsdRow {
  id: string;
  tracking_code: string;
  type: string;
  is_anonymous: boolean;
  full_name: string | null;
  email: string | null;
  subject: string;
  status: PqrsdStatus;
  created_at: string;
  response_deadline: string | null;
  is_overdue: boolean;
  city: string | null;
  phone: string | null;
}

export interface PqrsdDetail extends PqrsdRow {
  doc_type: string | null;
  doc_number: string | null;
  address: string | null;
  address_detail: string | null;
  response_mode: string;
  description: string;
  accepted_terms: boolean;
  terms_accepted_at: string | null;
  admin_notes: string | null;
  admin_response: string | null;
  responded_at: string | null;
  attachments: PqrsdAttachment[];
}

export interface PqrsdAttachment {
  id: string;
  file_name: string;
  original_name: string;
  file_url: string;
  mime_type: string;
  file_size_bytes: number;
}

export async function getPqrsdList(filters?: {
  status?: string;
  type?: string;
  search?: string;
  page?: number;
}) {
  const admin = createAdminClient();
  const PAGE_SIZE = 20;
  const page = filters?.page ?? 1;
  const from = (page - 1) * PAGE_SIZE;

  let query = admin
    .from("pqrsd")
    .select(
      "id, tracking_code, type, is_anonymous, full_name, email, subject, status, created_at, response_deadline, is_overdue, city, phone",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.type) query = query.eq("type", filters.type);
  if (filters?.search) {
    query = query.or(
      `tracking_code.ilike.%${filters.search}%,full_name.ilike.%${filters.search}%,subject.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
    );
  }

  const { data, count, error } = await query;
  if (error) throw new Error(error.message);

  return {
    rows: (data ?? []) as PqrsdRow[],
    total: count ?? 0,
    pages: Math.ceil((count ?? 0) / PAGE_SIZE),
  };
}

export async function getPqrsdById(id: string): Promise<PqrsdDetail | null> {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("pqrsd")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  const { data: attachments } = await admin
    .from("pqrsd_attachments")
    .select("id, file_name, original_name, file_url, mime_type, file_size_bytes")
    .eq("pqrsd_id", id);

  return { ...data, attachments: attachments ?? [] } as PqrsdDetail;
}

export async function updatePqrsdStatus(
  id: string,
  status: PqrsdStatus,
  adminNotes: string,
  adminResponse: string
) {
  const admin = createAdminClient();

  const update: Record<string, unknown> = {
    status,
    admin_notes: adminNotes || null,
    admin_response: adminResponse || null,
  };

  if (status === "respondido" || status === "cerrado") {
    update.responded_at = new Date().toISOString();
  }

  const { error } = await admin.from("pqrsd").update(update).eq("id", id);
  if (error) {
    console.error("[updatePqrsdStatus]", error);
    return { error: error.message };
  }

  revalidatePath("/gestion-interna/pqrs");
  revalidatePath(`/gestion-interna/pqrs/${id}`);
  return { success: true };
}

export async function getAttachmentSignedUrl(filePath: string) {
  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from("pqrsd-adjuntos")
    .createSignedUrl(filePath, 60 * 10); // 10 minutos

  if (error) return null;
  return data.signedUrl;
}

export async function getPqrsdStats() {
  const admin = createAdminClient();

  const [total, recibido, en_proceso, respondido, vencidas, semana] =
    await Promise.all([
      admin.from("pqrsd").select("*", { count: "exact", head: true }),
      admin.from("pqrsd").select("*", { count: "exact", head: true }).eq("status", "recibido"),
      admin.from("pqrsd").select("*", { count: "exact", head: true }).in("status", ["en_revision", "en_tramite"]),
      admin.from("pqrsd").select("*", { count: "exact", head: true }).eq("status", "respondido"),
      admin.from("pqrsd").select("*", { count: "exact", head: true }).eq("is_overdue", true).in("status", ["recibido", "en_proceso"]),
      admin.from("pqrsd").select("*", { count: "exact", head: true }).gte(
        "created_at",
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      ),
    ]);

  return {
    total: total.count ?? 0,
    recibido: recibido.count ?? 0,
    en_proceso: en_proceso.count ?? 0, // suma en_revision + en_tramite
    respondido: respondido.count ?? 0,
    vencidas: vencidas.count ?? 0,
    semana: semana.count ?? 0,
  };
}
