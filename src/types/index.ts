// Tipos de dominio del proyecto Cardiocentro Pediátrico de Sucre.
// Los tipos de base de datos se generan automáticamente con:
//   npx supabase gen types typescript --project-id <tu-project-id> > src/types/database.types.ts
// Luego importa desde ese archivo en lugar de definirlos manualmente.

export type Role = "admin" | "editor" | "viewer";

export interface Profile {
  id: string;
  email: string;
  nombre: string;
  role: Role;
  modulos_permitidos: string[];
  estado: "activo" | "suspendido";
  created_at: string;
}

// Alias usado por el módulo de administración de usuarios.
export type UsuarioAdmin = Profile;

export interface UsuariosPage {
  data: UsuarioAdmin[];
  total: number;
  pageCount: number;
  error: string | null;
}

export interface Pqrs {
  id: string;
  tipo: "peticion" | "queja" | "reclamo" | "sugerencia";
  nombre: string;
  email: string;
  telefono?: string;
  mensaje: string;
  anonimo: boolean;
  estado: "pendiente" | "en_proceso" | "resuelto";
  created_at: string;
}

export interface Servicio {
  id: string;
  titulo: string;
  descripcion: string;
  icono_url?: string;
  orden: number;
}

export interface MiembroEquipo {
  id: string;
  nombre: string;
  apellido: string;
  cargo: string;
  especialidad?: string;
  foto_url?: string;
}

export interface Normativa {
  id: string;
  titulo: string;
  descripcion?: string;
  archivo_url?: string;
  fecha: string;
}

export interface HeroSlide {
  id: string;
  orden: number;
  imagen_url: string;
  imagen_alt: string;
  badge_texto: string | null;
  titulo: string;
  subtitulo: string | null;
  es_principal: boolean;
}

export interface EquipoHero {
  id: string;
  pagina: "humano" | "tecnologico";
  imagen_url: string;
  imagen_alt: string;
}

export interface EquipoGrupo {
  id: string;
  nombre: string;
  orden: number;
  miembros: EquipoMiembro[];
}

export interface EquipoMiembro {
  id: string;
  grupo_id: string;
  nombre: string;
  cargo: string;
  especialidad: string;
  formacion: string[];
  foto_url: string;
  imagen_alt: string;
  orden: number;
  activo: boolean;
}

export interface EquipoTec {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  imagen_url: string;
  imagen_alt: string;
  orden: number;
  activo: boolean;
}

export interface Pagina {
  id: string;
  slug: string;
  titulo: string;
  contenido: string;
  meta_descripcion?: string;
  publicado: boolean;
  updated_at: string;
}
