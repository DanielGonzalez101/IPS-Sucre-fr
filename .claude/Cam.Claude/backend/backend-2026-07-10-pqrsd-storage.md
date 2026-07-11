# Solicitud backend — Sistema PQRSD

**Fecha:** 2026-07-10  
**Contexto:** Estamos construyendo el formulario público de PQRSD. El frontend ya valida, genera el radicado y sube archivos al bucket de Supabase Storage. Necesitamos que el backend configure el bucket y las políticas RLS para que el flujo funcione.

---

## 1. Bucket de Storage

Crear el bucket `pqrsd-adjuntos` en Supabase Storage con estas características:

| Parámetro | Valor |
|-----------|-------|
| Nombre | `pqrsd-adjuntos` |
| Acceso | **Privado** (no público) |
| Tamaño máximo por archivo | 5 MB |
| MIME types permitidos | `application/pdf`, `image/jpeg`, `image/png` |

El frontend usa `service_role` key (a través del `createAdminClient`) para subir archivos, así que no necesita policy de INSERT para anónimos en storage — solo necesita que el bucket exista.

Para que los admins puedan ver los adjuntos desde el panel de gestión, se necesitará generar **signed URLs** al momento de visualizar (no public URL).

---

## 2. RLS en tabla `pqrsd`

La tabla necesita política de INSERT para usuarios anónimos (el ciudadano no está autenticado):

```sql
-- Permite que cualquier persona inserte una PQRSD (formulario público)
CREATE POLICY "pqrsd_insert_public"
ON public.pqrsd
FOR INSERT
TO anon
WITH CHECK (true);

-- Solo admins autenticados pueden leer y actualizar
CREATE POLICY "pqrsd_select_admin"
ON public.pqrsd
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "pqrsd_update_admin"
ON public.pqrsd
FOR UPDATE
TO authenticated
USING (true);
```

> **Nota:** El INSERT desde el frontend usa `service_role` (admin client), que bypasea RLS. Estas políticas son para el futuro si se migra a anon key.

---

## 3. RLS en tabla `pqrsd_attachments`

```sql
-- Lectura y escritura solo para admins
CREATE POLICY "attachments_admin_all"
ON public.pqrsd_attachments
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
```

---

## 4. Confirmar valores de los ENUMs en Supabase

El frontend asume estos valores para los tipos de datos personalizados. Por favor confirmar que coinciden con los definidos en la DB:

**`pqrsd_type`:**
```
peticion | queja | reclamo | solicitud | denuncia | sugerencia
```

**`doc_type`:**
```
CC | CE | NUIP | TI | NIT | Pasaporte | PPT | Otro
```

**`response_mode`:**
```
email | correspondencia
```

**`pqrsd_status`:**
```
recibido | en_proceso | respondido | cerrado
```

Si algún valor difiere, avisar a Daniel para actualizar la validación en `src/lib/validations/pqrs.ts`.

---

## 5. Impacto en el frontend cuando esté listo

- El POST a `/api/pqrsd` comenzará a funcionar completamente (ahora falla si el bucket no existe).
- Los adjuntos quedarn guardados en `pqrsd-adjuntos/{pqrsd_id}/{timestamp-random}.ext`.
- El administrador podrá ver las solicitudes en el panel `/gestion-interna/pqrs`.