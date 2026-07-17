"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getAuditDocuments() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("documents")
    .select("id, title, file_url, description, uploaded_at, is_public")
    .eq("is_audit_doc", true)
    .order("uploaded_at", { ascending: false });
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function uploadAndCreateAuditDocument(formData: FormData) {
  const file = formData.get("file") as File | null;
  const title = (formData.get("title") as string | null)?.trim();
  const description = (formData.get("description") as string | null)?.trim() || null;
  const is_public = formData.get("is_public") === "true";

  if (!file || file.size === 0) return { error: "Archivo requerido", file_url: null };
  if (!title) return { error: "Título requerido", file_url: null };
  if (file.size > 20 * 1024 * 1024) return { error: "Máximo 20 MB", file_url: null };

  const supabase = createAdminClient();

  const filename = `auditoria-${Date.now()}.pdf`;
  const bytes = await file.arrayBuffer();
  const { error: storageError } = await supabase.storage
    .from("documents")
    .upload(filename, bytes, { contentType: "application/pdf", upsert: true });

  if (storageError) return { error: storageError.message, file_url: null };

  const { data: { publicUrl } } = supabase.storage.from("documents").getPublicUrl(filename);

  const { error: dbError } = await supabase.from("documents").insert({
    title,
    category: "Auditoría",
    file_url: publicUrl,
    description,
    is_audit_doc: true,
    is_public,
  });

  if (dbError) return { error: dbError.message, file_url: null };

  revalidatePath("/gestion-interna/normativa");
  return { error: null, file_url: publicUrl };
}

export async function toggleDocumentPublic(id: string, is_public: boolean) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("documents").update({ is_public }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/gestion-interna/normativa");
  return { error: null };
}

export async function deleteAuditDocument(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("documents").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/gestion-interna/normativa");
  return { error: null };
}

export async function getPublicFinancialDocuments() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("documents")
    .select("id, title, file_url, description, uploaded_at")
    .eq("is_audit_doc", true)
    .eq("is_public", true)
    .order("uploaded_at", { ascending: false });
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}
