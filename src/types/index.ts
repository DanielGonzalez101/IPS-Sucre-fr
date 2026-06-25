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
  created_at: string;
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

export interface Pagina {
  id: string;
  slug: string;
  titulo: string;
  contenido: string;
  meta_descripcion?: string;
  publicado: boolean;
  updated_at: string;
}
