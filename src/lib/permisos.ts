// Fuente única de módulos del panel administrativo. Sidebar, proxy y las
// Server Actions de usuarios se basan en esta lista para no desincronizarse.

export interface ModuloDef {
  slug: string;
  label: string;
  ruta: string; // path relativo bajo /gestion-interna
}

export const MODULOS: ModuloDef[] = [
  { slug: "dashboard",          label: "Dashboard",                   ruta: "/dashboard" },
  { slug: "hero",               label: "Carrusel (página principal)", ruta: "/hero" },
  { slug: "equipo-humano",      label: "Equipo humano",               ruta: "/equipo/humano" },
  { slug: "equipo-tecnologico", label: "Equipo tecnológico",          ruta: "/equipo/tecnologico" },
  { slug: "paginas",            label: "Páginas",                     ruta: "/paginas" },
  { slug: "servicios",          label: "Servicios",                   ruta: "/servicios" },
  { slug: "normativa",          label: "Normativa",                   ruta: "/normativa" },
  { slug: "pqrs",               label: "PQRS",                        ruta: "/pqrs" },
  { slug: "usuarios",           label: "Usuarios",                    ruta: "/usuarios" },
  { slug: "sitio",              label: "Datos del sitio",             ruta: "/sitio" },
];

export const MODULO_SLUGS = MODULOS.map((m) => m.slug) as [string, ...string[]];

export const USUARIOS_PAGE_SIZE = 10;

// Módulo siempre accesible — evita loops de redirect a un usuario sin permisos.
export const MODULO_SIEMPRE_PERMITIDO = "dashboard";

// Empareja el segmento más largo primero para que "/equipo/humano" no matchee "/equipo".
export function moduloDeRuta(pathname: string): ModuloDef | undefined {
  return [...MODULOS]
    .sort((a, b) => b.ruta.length - a.ruta.length)
    .find(
      (m) =>
        pathname === `/gestion-interna${m.ruta}` ||
        pathname.startsWith(`/gestion-interna${m.ruta}/`)
    );
}
