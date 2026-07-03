# Comunicación con el backend (Supabase)

## Tres clientes disponibles

| Archivo | Cuándo usar |
|---|---|
| `src/lib/supabase/server.ts` | Server Components, Server Actions, Route Handlers — contexto con cookies de sesión |
| `src/lib/supabase/client.ts` | Client Components que necesiten acceso en tiempo real o suscripciones |
| `src/lib/supabase/admin.ts` | Operaciones privilegiadas que bypasean RLS (solo en Route Handlers seguros, nunca en el cliente) |

> Nunca importar `admin.ts` desde un Client Component ni desde código expuesto al navegador.

## Server Actions — patrón estándar

```ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({ titulo: z.string().min(1) });

export async function crearEntidad(data: unknown) {
  // 1. Validar con Zod
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  // 2. Obtener cliente con sesión
  const supabase = await createClient();

  // 3. Operación en la base de datos
  const { error } = await supabase.from("tabla").insert(parsed.data);

  // 4. Retornar resultado — nunca lanzar excepciones al cliente
  if (error) return { error: { _server: [error.message] } };
  return { success: true };
}
```

### Reglas de las Server Actions
- Siempre marcar el archivo con `"use server"` en la primera línea.
- Siempre validar con Zod antes de tocar Supabase.
- El tipo de retorno: `{ success: true }` | `{ error: FieldErrors | { _server: string[] } }`.
- No usar `redirect()` dentro de try/catch — Next.js 16 lo implementa como excepción internamente.
- Las acciones que modifican datos deben llamar `revalidatePath()` o `revalidateTag()` para invalidar caché.

```ts
import { revalidatePath } from "next/cache";

// Al final de una acción de escritura exitosa:
revalidatePath("/admin/servicios");
```

## Queries de solo lectura en Server Components

```tsx
// app/(admin)/admin/servicios/page.tsx
import { getServicios } from "@/actions/servicios";

export default async function ServiciosPage() {
  const servicios = await getServicios(); // lanza Error si falla — se captura en error.tsx
  return <DataTable columns={...} data={servicios} />;
}
```

Las funciones que solo leen datos (`get*`) lanzan error con `throw new Error(error.message)`. El `error.tsx` del segmento de ruta correspondiente lo captura.

## Manejo de errores de Supabase

| Situación | Comportamiento esperado |
|---|---|
| Error en lectura (Server Component) | `throw new Error(message)` → capturado por `error.tsx` |
| Error en escritura (Server Action) | `return { error: ... }` → mostrado en el formulario |
| Error en Route Handler | `return NextResponse.json({ error: message }, { status: 500 })` |

## RLS (Row Level Security)
Las políticas de RLS están definidas en Supabase. Los clientes `server.ts` y `client.ts` respetan RLS automáticamente. El cliente `admin.ts` usa la `SERVICE_ROLE_KEY` que las bypasea — usarlo solo para operaciones de sistema (webhooks, migraciones, seeds).

## Tipos de la base de datos
Los tipos manuales viven en `src/types/index.ts`. Para generarlos automáticamente desde el esquema real de Supabase:
```bash
npx supabase gen types typescript --project-id <project-id> > src/types/database.types.ts
```
Importar desde `database.types.ts` cuando se necesite precisión total de columnas.

## Variables de entorno
```
NEXT_PUBLIC_SUPABASE_URL        # URL pública del proyecto Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY   # Clave anon (segura para el cliente)
SUPABASE_SERVICE_ROLE_KEY       # Solo servidor — nunca exponer al cliente
```
