// Script de carga masiva de documentos financieros a Supabase
// Uso: node scripts/upload-docs.mjs
//
// Lee .env del proyecto, sube cada PDF de /docs al storage "documents",
// y crea un registro en la tabla "documents" con is_audit_doc=true, is_public=true.
// Si el archivo ya existe en storage lo sobreescribe (upsert).

import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "fs";
import { join, basename } from "path";
import { fileURLToPath } from "url";

// ── Cargar .env manualmente (sin dotenv) ─────────────────────
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const envPath = join(__dirname, "../.env");
const envLines = readFileSync(envPath, "utf-8").split("\n");
for (const line of envLines) {
  const [key, ...rest] = line.split("=");
  if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌  Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Títulos legibles por nombre de archivo ────────────────────
const TITULOS = {
  "estados-financieros-2025.pdf":              "Estados financieros 2025",
  "estados-financieros-2024.pdf":              "Estados financieros 2024",
  "estados-financieros-2023-2022.pdf":         "Estados financieros 2023-2022",
  "estados-financieros-2022.pdf":              "Estados financieros 2022",
  "estados-financieros-2021.pdf":              "Estados financieros 2021",
  "estados-financieros-2020-cardiocentro.pdf": "Estados financieros 2020",
  "estados-financieros-2018.pdf":              "Estados financieros 2017-2018",
  "estados-financieros-2016-2.pdf":            "Estados financieros 2016",
  "dictamen-revisor-fiscal.pdf":               "Dictamen del revisor fiscal",
  "certificacion-estados-financieros-2.pdf":   "Certificación de estados financieros",
  "notas-est-fin-2016-3.pdf":                  "Notas a los estados financieros 2016",
};

const DOCS_DIR = join(__dirname, "../docs");
const files = readdirSync(DOCS_DIR).filter((f) => f.endsWith(".pdf"));

console.log(`\n📂  Encontrados ${files.length} PDFs en /docs\n`);

for (const filename of files) {
  const filePath = join(DOCS_DIR, filename);
  const fileBuffer = readFileSync(filePath);
  const title = TITULOS[filename] ?? basename(filename, ".pdf").replace(/[-_]/g, " ");
  const storagePath = `financiero/${filename}`;

  process.stdout.write(`  ⬆️  ${filename} … `);

  // 1. Subir al storage
  const { error: storageError } = await supabase.storage
    .from("documents")
    .upload(storagePath, fileBuffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (storageError) {
    console.log(`❌  Storage: ${storageError.message}`);
    continue;
  }

  const { data: { publicUrl } } = supabase.storage
    .from("documents")
    .getPublicUrl(storagePath);

  // 2. Verificar si ya existe en la tabla (por file_url)
  const { data: existing } = await supabase
    .from("documents")
    .select("id")
    .eq("file_url", publicUrl)
    .maybeSingle();

  if (existing) {
    console.log(`↩️  Ya existe en DB, omitido`);
    continue;
  }

  // 3. Insertar en tabla documents
  const { error: dbError } = await supabase.from("documents").insert({
    title,
    category: "Estados Financieros",
    file_url: publicUrl,
    description: null,
    is_audit_doc: true,
    is_public: true,
  });

  if (dbError) {
    console.log(`❌  DB: ${dbError.message}`);
    continue;
  }

  console.log(`✅  OK`);
}

console.log("\n✔️  Carga completada.\n");
