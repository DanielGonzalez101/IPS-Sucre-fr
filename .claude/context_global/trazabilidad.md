# Trazabilidad

## Qué registrar y dónde

### Acciones de usuario en el admin
Toda operación crítica (crear, actualizar, eliminar) debe poder rastrearse. La estrategia actual usa los campos de auditoría de Supabase:
- `created_at` — timestamp automático (`DEFAULT now()`).
- `updated_at` — actualizado mediante trigger en Supabase o manualmente al hacer `update`.

Para operaciones sensibles (cambio de rol, eliminación de registros) se recomienda añadir una tabla `audit_log` con:
```sql
CREATE TABLE audit_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tabla       text NOT NULL,
  operacion   text NOT NULL,          -- 'INSERT' | 'UPDATE' | 'DELETE'
  registro_id text NOT NULL,
  usuario_id  uuid REFERENCES auth.users(id),
  datos_antes jsonb,
  datos_despues jsonb,
  created_at  timestamptz DEFAULT now()
);
```

### PQRS — ciclo de vida
El campo `estado` en la tabla `pqrs` es el indicador de trazabilidad principal:
```
pendiente → en_proceso → resuelto
```
Cada cambio de estado debe quedar reflejado con el `updated_at` correspondiente. Si se implementa historial de estados, crear tabla `pqrs_estados` relacionada.

### Webhooks de Supabase
`src/app/api/webhooks/supabase/route.ts` recibe eventos de base de datos. Los eventos que llegan aquí deben loguearse antes de procesarse para no perder trazabilidad si el handler falla.

## Logging en Server Actions
Patrón mínimo ante errores:
```ts
export async function updateEstadoPqrs(id: string, estado: Pqrs["estado"]) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("pqrs")
    .update({ estado, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    // Log al servidor — visible en los logs de Vercel / plataforma de despliegue.
    console.error("[pqrs:updateEstado]", { id, estado, error: error.message });
    return { error: error.message };
  }
  return { success: true };
}
```

## Convenciones de prefijo para logs
| Prefijo | Uso |
|---|---|
| `[auth:*]` | Eventos de autenticación |
| `[pqrs:*]` | Operaciones sobre PQRS |
| `[equipo:*]` | Operaciones sobre miembros del equipo |
| `[paginas:*]` | Gestión de páginas CMS |
| `[webhook:*]` | Eventos recibidos por los webhooks |

## Lo que NO se loguea
- Contraseñas, tokens, ni ningún dato sensible.
- Datos personales del paciente/ciudadano en texto plano en logs de consola.
