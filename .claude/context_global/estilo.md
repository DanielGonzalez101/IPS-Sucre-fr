# Guía de estilo

## Sistema de diseño
Tailwind CSS v4 — configurado con `@import "tailwindcss"` en `globals.css`. No hay archivo `tailwind.config.ts`; las personalizaciones van en CSS usando las directivas `@theme`.

## Paleta de colores
| Rol | Clase Tailwind | Uso |
|---|---|---|
| Primario | `blue-600` / `blue-700` (hover) | Botones de acción principal, enlaces activos |
| Peligro | `red-600` / `red-700` (hover) | Acciones destructivas |
| Neutro | `gray-*` | Bordes, fondos, texto secundario |
| Fondo admin | `bg-gray-50` | Fondo de la zona administrativa |
| Superficie | `bg-white` | Tarjetas, tablas, formularios |

## Tipografía
- Tamaño base: `text-sm` en el panel admin.
- Encabezados de sección: `text-lg font-semibold text-gray-800`.
- Labels de formulario: `text-sm font-medium text-gray-700`.
- Texto de apoyo / meta: `text-gray-500`.

## Componentes base existentes
### `Button` (`src/components/ui/Button.tsx`)
```tsx
<Button variant="primary">Guardar</Button>   // azul
<Button variant="secondary">Cancelar</Button> // gris
<Button variant="danger">Eliminar</Button>    // rojo
```
Siempre usar este componente; no crear botones ad-hoc con clases manuales.

### `DataTable` (`src/components/admin/DataTable.tsx`)
Tabla genérica para el panel admin. Recibe `columns` y `data`.
```tsx
<DataTable
  columns={[{ key: "nombre", header: "Nombre" }, { key: "estado", header: "Estado" }]}
  data={rows}
/>
```

## Layout del panel admin
- Sidebar fijo a la izquierda (`components/admin/Sidebar.tsx`).
- Contenido principal con padding `p-6` o `p-8`.
- Secciones separadas por `space-y-6`.

## Layout del sitio público
- Header (`components/public/Header.tsx`) y Footer (`components/public/Footer.tsx`) envuelven el contenido vía el layout de grupo `(public)/layout.tsx`.
- Máximo ancho de contenido: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.

## Formularios
- Inputs: `border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`
- Mensajes de error de campo: `text-red-600 text-xs mt-1`
- Mensajes de error globales: bloque rojo con `bg-red-50 border border-red-200 text-red-700 rounded p-3`

## Iconografía
Usar URLs de iconos almacenadas en Supabase Storage (campo `icono_url` en `Servicio`, `foto_url` en `MiembroEquipo`). No incluir librerías de iconos de terceros salvo decisión explícita.
