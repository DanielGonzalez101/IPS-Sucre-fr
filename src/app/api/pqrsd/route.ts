import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { pqrsdSchema } from "@/lib/validations/pqrs";
import { rateLimit } from "@/lib/rate-limit";
import { verifyRecaptcha } from "@/lib/recaptcha";

const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_FILES = 3;
const STORAGE_BUCKET = "pqrsd-adjuntos";

function detectMimeType(buffer: Uint8Array): string | null {
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "image/png";
  }
  if (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  ) {
    return "application/pdf";
  }
  return null;
}

async function generateTrackingCode(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<string> {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const prefix = `PQRSD-${today}-`;

  const { count } = await supabase
    .from("pqrsd")
    .select("*", { count: "exact", head: true })
    .like("tracking_code", `${prefix}%`);

  const nextNum = (count ?? 0) + 1;
  return `${prefix}${String(nextNum).padStart(4, "0")}`;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const limit = rateLimit(`pqrsd:${ip}`, 50, 60 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intente más tarde." },
      { status: 429 }
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const recaptchaToken = formData.get("recaptcha_token");
  if (typeof recaptchaToken === "string" && recaptchaToken) {
    const ok = await verifyRecaptcha(recaptchaToken);
    if (!ok) {
      return NextResponse.json(
        { error: "Verificación de seguridad fallida. Intente nuevamente." },
        { status: 422 }
      );
    }
  }

  // Extract and validate files
  const fileEntries = formData.getAll("adjuntos") as File[];
  const files = fileEntries.filter((f) => f instanceof File && f.size > 0);

  if (files.length > MAX_FILES) {
    return NextResponse.json(
      { error: `Máximo ${MAX_FILES} archivos permitidos` },
      { status: 422 }
    );
  }

  // Validate each file
  const validatedFiles: Array<{
    file: File;
    mimeType: string;
    buffer: Uint8Array;
  }> = [];

  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `El archivo "${file.name}" supera el límite de 5 MB` },
        { status: 422 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const detectedMime = detectMimeType(buffer);

    if (!detectedMime || !ALLOWED_MIME_TYPES.includes(detectedMime)) {
      return NextResponse.json(
        {
          error: `El archivo "${file.name}" no es un tipo permitido (PDF, JPG, PNG)`,
        },
        { status: 422 }
      );
    }

    validatedFiles.push({ file, mimeType: detectedMime, buffer });
  }

  // Build pqrsd data object from FormData
  const raw = {
    type: formData.get("type"),
    is_anonymous: formData.get("is_anonymous") === "true",
    full_name: formData.get("full_name") || undefined,
    doc_type: formData.get("doc_type") || undefined,
    doc_number: formData.get("doc_number") || undefined,
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    address: formData.get("address") || undefined,
    address_detail: formData.get("address_detail") || undefined,
    city: formData.get("city") || undefined,
    response_mode: formData.get("response_mode") ?? "email",
    subject: formData.get("subject"),
    description: formData.get("description"),
    accepted_terms: formData.get("accepted_terms") === "true",
    terms_version: formData.get("terms_version") || undefined,
  };

  const parsed = pqrsdSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", fields: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const data = parsed.data;

  const supabase = await createClient();
  const admin = createAdminClient();

  // Get latest terms version
  const { data: termsData } = await supabase
    .from("privacy_policy_versions")
    .select("version")
    .order("published_at", { ascending: false })
    .limit(1)
    .single();

  const tracking_code = await generateTrackingCode(supabase);

  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 15);

  const { data: pqrsdRecord, error: insertError } = await admin
    .from("pqrsd")
    .insert({
      tracking_code,
      type: data.type,
      is_anonymous: data.is_anonymous,
      full_name: data.is_anonymous ? null : data.full_name,
      doc_type: data.is_anonymous ? null : data.doc_type,
      doc_number: data.is_anonymous ? null : data.doc_number,
      email: data.email,
      phone: data.phone || null,
      address: data.address || null,
      address_detail: data.address_detail || null,
      city: data.city || null,
      response_mode: data.response_mode,
      subject: data.subject,
      description: data.description,
      accepted_terms: true,
      terms_version: termsData?.version ?? null,
      terms_accepted_at: new Date().toISOString(),
      status: "recibido",
      response_deadline: deadline.toISOString(),
    })
    .select("id")
    .single();

  if (insertError || !pqrsdRecord) {
    console.error("Error inserting pqrsd:", insertError);
    return NextResponse.json(
      { error: "No se pudo registrar la solicitud. Intente nuevamente." },
      { status: 500 }
    );
  }

  const pqrsdId = pqrsdRecord.id;

  // Upload attachments
  for (const { file, mimeType, buffer } of validatedFiles) {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const storagePath = `${pqrsdId}/${safeName}`;

    const { error: uploadError } = await admin.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, buffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading attachment:", uploadError);
      continue;
    }

    await admin.from("pqrsd_attachments").insert({
      pqrsd_id: pqrsdId,
      file_name: safeName,
      original_name: file.name,
      file_url: storagePath,
      mime_type: mimeType,
      file_size_bytes: file.size,
    });
  }

  // TODO: Enviar email de acuse de recibo al ciudadano (segunda iteración)

  return NextResponse.json({ tracking_code }, { status: 201 });
}
