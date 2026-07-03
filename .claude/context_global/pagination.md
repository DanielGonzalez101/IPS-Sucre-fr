# Paginación

## Patrón estándar con Supabase

Supabase expone paginación mediante `range(from, to)`. El convenio en este proyecto es offset-based con tamaño de página configurable.

```ts
// Server Action — ejemplo con la tabla "pqrs"
const PAGE_SIZE = 10;

export async function getPqrsPage(page: number) {
  const supabase = await createClient();
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error, count } = await supabase
    .from("pqrs")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw new Error(error.message);

  return {
    data: data ?? [],
    total: count ?? 0,
    pageCount: Math.ceil((count ?? 0) / PAGE_SIZE),
  };
}
```

## Parámetros de URL (Server Components)
En páginas del panel admin que usen paginación, recibir la página por `searchParams`:

```tsx
// app/(admin)/admin/pqrs/page.tsx
export default async function PqrsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(0, Number(page ?? 0));
  const { data, total, pageCount } = await getPqrsPage(currentPage);
  // ...
}
```

> **Next.js 16:** `searchParams` es una `Promise` — siempre usar `await`.

## Componente de paginación
El componente usa `<Link>` con `?page=N` para evitar hidratación innecesaria. No usa estado del cliente.

```tsx
// components/ui/Pagination.tsx
import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  pageCount: number;
  basePath: string; // ej. "/admin/pqrs"
}

export default function Pagination({ currentPage, pageCount, basePath }: PaginationProps) {
  if (pageCount <= 1) return null;
  return (
    <nav className="flex items-center gap-2 text-sm">
      {currentPage > 0 && (
        <Link href={`${basePath}?page=${currentPage - 1}`} className="px-3 py-1 rounded border hover:bg-gray-100">
          Anterior
        </Link>
      )}
      <span className="text-gray-500">
        {currentPage + 1} / {pageCount}
      </span>
      {currentPage < pageCount - 1 && (
        <Link href={`${basePath}?page=${currentPage + 1}`} className="px-3 py-1 rounded border hover:bg-gray-100">
          Siguiente
        </Link>
      )}
    </nav>
  );
}
```

## Reglas
- El índice de página empieza en `0` internamente; mostrar `page + 1` al usuario.
- Siempre pasar `{ count: "exact" }` a `select()` cuando se necesite el total.
- No paginar listas pequeñas (< 20 ítems) que no crecerán significativamente.
